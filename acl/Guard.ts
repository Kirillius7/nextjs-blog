import { UserRole as ROLE } from "../constants";
import { Logger } from "../Server/logger";
import Acl from "./Acl";
import { GRANT, IRoles, IRules } from "./types";

class Guard { // обʼєкт, що відповідає за перевірку доступу до ресурсів та дій з ними на основі ролей та правил ACL
	//контролер доступу між HTTP-запитом і бізнес-логікою
	private mAcl: Acl; // система/структура правил доступу
	private mRules?: IRules;
	private mRoles?: IRoles;
	private mRole?: ROLE;
	private secret?: string;
	public resource?: string;

	constructor(
		roles?: IRoles,
		rules?: IRules,
		role?: ROLE,
		secret?: string,
	) {
		this.mRules = rules;
		this.mRoles = roles;
		this.mRole = role;
		this.secret = secret && secret.length > 0 ? secret : undefined;
		this.mAcl = new Acl(roles, rules, this.secret);
	}

	// get методи для доступу до приватних властивостей класу Guard
	public get role() {
		return this.mRole;
	}
	public get acl() {
		return this.mAcl;
	}
	public get rules() {
		return this.mRules;
	}
	public get roles() {
		return this.mRoles;
	}
	public update(
		roles?: IRoles,
		rules?: IRules,
		role?: ROLE,
		secret?: string,
	) {
		this.secret = secret && secret.length > 0 ? secret : undefined;
		this.mRules = rules;
		this.mRoles = roles;
		this.mAcl = new Acl(roles, rules, this.secret);
		this.mRole = role;
	}

	/**
 * Checks if the given path matches any of the defined routing rules.
 * Supports wildcard '*' in rule definitions and ignores trailing slashes.
 * 
 * @param path - The input path to match against the defined rules.
 * @returns The matched rule string if found, or null if no match is found.
 */
	private isRouteMatch(path: string): string | null {
		if (!this.rules) return null; // якщо правила не визначені, повертається null
		
		if (path.length > 1 && path.substring(path.length - 1) === "/") { // перевірка останнього символу "/" у url для його видалення (щоб /users/13/ === /users/13)
			path = path.substring(0, path.length - 1);
		}
		const pParts = path && path.split("/"); // розділення шляху на частини "/" для порівняння у разі якщо path існує

		for (const resource in this.rules) { // перебір усіх ресурсів у правилах для пошуку відповідності
			if (this.rules.hasOwnProperty(resource)) { // перевірка наявності ресурсу у правилах для уникнення успадкованих властивостей
				const rParts = resource.split("/"); // розділення ресурсу на частини "/" для порівняння з path
				if (rParts.length < pParts.length) continue; // якщо ресурс має менше частин, ніж path, пропускаємо його (бо не може бути відповідності)
				let result: any = null;
				for (let i = 0; i < rParts.length; i++) {
					if (!(rParts[i] === pParts[i] || rParts[i] === "*")) { // перевірка на відповідність частин rParts (["", "users", "13"] та pParts (["", "users", "*"])
						// якщо rParts[2] = "*" !== pParts[2] = "13", але rParts[2] = "*" === rParts[i] === "*" - то правило спрацювало, це є потрібна wildcard
						result = null;
						break;
					}
					result = resource; // якщо всі частини збігаються, то ресурс асигнується як результат
				}
				if (result) {
					return result; // якщо result не null, повертається знайдений ресурс як відповідність
				}
			}
		}
		return null; // якщо жодна відповідність до wildcard не знайдена, повертається null
	}

	/**
 * Checks if a given resource path is defined in the routing rules.
 * First attempts a direct match, then tries pattern-based matching.
 * 
 * @param resource - The path or resource to check.
 * @returns true if the resource matches a route, false otherwise.
 */
	public inRouter(resource: string) {
		if (!this.rules) return false;
		let isRouter = false;
		try {
			if (this.rules.hasOwnProperty(resource)) {
				isRouter = true;
			} else {
				const match = this.isRouteMatch(resource);
				if (match) {
					if (this.rules.hasOwnProperty(match)) {
						isRouter = true;
					}
				}
			}
		} catch (e) {
			Logger.error((e as Error).message)
			isRouter = false;
		}
		return isRouter;
	}

	public allow( // перевірка дозволу на доступ до ресурсу з урахуванням ролі
		grant: GRANT,
		resource: string | null = null,
		secret: string | null = null,
		role: ROLE | null = null
	) {
		resource = resource ?? this.resource ?? null; // перевірка на наявність ресурсу, якщо не передано, використовується ресурс з обʼєкта Guard
		const s = secret || this.secret ? (secret ?? this.secret) + ":" : ""; // формування префіксу для секрету, якщо він є
		role = role ?? this.role ?? null; // перевірка на наявність ролі, якщо не передано, використовується роль з обʼєкта Guard
		let isAllowed = false; // базове значення дозволу на доступ до ресурсу

		// if(!resource) throw new Error('No Resource in Guard')
		if (!resource || !role || !this.rules) { // перевірка на наявність ресурсу, ролі та правил, якщо будь-який з них відсутній, виводиться попередження
			Logger.warn(
				'Guard missing: ' +
				[
					!resource && 'resource',
					!role && 'role',
					!this.rules && 'rules'
				].filter(Boolean).join(' & ')
			);
			return false;
		}
		try {
			if (this.rules.hasOwnProperty(resource)) { // перевірка наявності ресурсу з-поміж наявних правил, виконується перевірка дозволу на доступ
				// hasOwnProperty є перевіркою типу "пошук" властивості в обʼєкті, це краще за індекс (адже визначений на місці, а не успадкований з іншого обʼєкта)

				isAllowed = this.acl.isAllowed(s + role, s + resource, grant); // роль + ресурс (шлях) + дія (grant) => acl-перевірка
			} else { // якщо прямого збігу немає, виконується перевірка на відповідність ресурсу до правил з використанням шаблонів (wildcard)
				const match = this.isRouteMatch(resource); // query - дає можливість працювати з /users, params - ні, потрібна wildcard
				if (match) {
					// Logger.log('match', match)
					if (this.rules.hasOwnProperty(match)) {
						isAllowed = this.acl.isAllowed(s + role, s + match, grant);
					}
				}
			}
		} catch (e) {
			Logger.error('allow error', (e as Error).message)
			isAllowed = false;
		}
		// Logger.log("allow: ", this.role, resource, grant, ':',isAllowed);

		return isAllowed;
	}
}

export default Guard;
