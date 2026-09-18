import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import container from "../DI/container"; // залишаємо DI-контейнер для отримання сервісів
import { UserService } from "../Services/UserService";

// Серіалізація для запису в Redis тільки ID користувача, спрацьовує (викликає passport власноруч) лише 1 раз (під час успішної логінації - passport.use() на 4 кроці)
/*passport.serializeUser((user: any, done) => {
  done(null, user.id); // збереження лише id в сесію express, щоб не засмічувати redis
  // якщо дані правильні - done(null, user.id), інакше - done(null, undefined)
});*/

passport.serializeUser((identity: any, done) => {
  done(null, identity); // збереження лише id в сесію express, щоб не засмічувати redis
  // якщо дані правильні - done(null, user.id), інакше - done(null, undefined)
});


// Десеріалізація пошук повного об'єкту користувача з БД за ID з Redis (спрацьовує кожен раз, коли є запит від користувача)
// спрацьовує за викликом passport на 3 кроці (якщо passport/redis побачили id користувача в req.session і на основі цього відбудеться запис в req.user)
// (відповідальність middleware passport.session())
/*
passport.deserializeUser((id: number, done) => {
  const User = container.resolve("User") as any; // модель користувача з контейнера


  User.findByPk(id)
    .then((user) => {
      if (user) {
        done(null, user.get()); // запис даних користувача в req.user (user.get() - повернення чистих даних без допоміжних функцій)
      } else {
        done(null, false);
      }
    })
    .catch((err) => {
      done(err);
    });
});*/

passport.deserializeUser((identity: any, done) => {
  const User = container.resolve("User") as any; // модель користувача з контейнера

  /*
  User.findByPk(id)
    .then((user) => {
      if (user) {
        done(null, user.get()); // запис даних користувача в req.user (user.get() - повернення чистих даних без допоміжних функцій)
      } else {
        done(null, false);
      }
    })
    .catch((err) => {
      done(err);
    });
  */

  done(null, identity)
});

// перевірка даних під час логінації на коректність (відповідальність middleware passportLocalLogin на 4 кроці)
// на етапі компіляції запис LocalStrategy як методу, який треба викликати 
passport.use(
  new LocalStrategy( // паспорт власноруч викликає колбек, використовуючи заготовку через passport.use
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, // дозволяє прокидати об'єкт запиту (req) у колбек, якщо треба
    },
    async (req, email, password, done) => { // контракт, який викликає passport всередині 4 кроку (автентифікації)
      try {
        
        // створення обʼєкта на основі даних в контейнері для майбутнього доступу до БД (на основі Sequelize)
        const userService = container.resolve("UserService") as UserService;

        // виклик методу для пошуку користувача в базі даних
        const user = await userService.findUserWithEmailAndPassword(email, password);
        // id, first/ last name, email, role -> identity object + avatar or settings (preferences) -> done (null, identity)
        
        // Якщо користувач null (його немає або пароль неправильний)
        if (!user) {
          // перший аргумент - системні збої, другий - дані користувача
          return done(null, false, { message: "Email or password is incorrect" }); 
        }

        //
        const userData = user.get ? user.get() : user;
        const identity = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          preferences: {
            hobby: "Table Tennis",
            language: "American English",
            time_zone: "Pacific Time Zone",
            theme: "light"
          }
        }
        //

        // у разі успіху паспорт передає чистий об'єкт з подальшим викликом serializeUser
        //return done(null, user.get());
        return done(null,identity)

      } catch (err) {
        console.error('Критична помилка в LocalStrategy:', err);
        return done(err); // передача помилки в Passport для коректного закриття запиту
      }
    }
  )
);

// експорт готової middleware для авторизації під час логінації (використовується лише під час doAuthMiddlewares)
// запис local потрібний для того, щоб використати зареєстрований метод LocalStrategy для перевірки даних під час логінації
export const passportLocalLogin = passport.authenticate("local");

export default passport;
