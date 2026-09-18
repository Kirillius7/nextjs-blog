import 'reflect-metadata';

export default function POST(routeName: string = '*') { // під час startup-app першого запуску
  return (target: object, propertyKey: string) => {
    let properties: any =
      Reflect.getMetadata(routeName, target);
      /*
      Reflect.getMetadata("routger", {
        [routeName]: {
          POST: {

          },

        }
      });
      */
     
      /*
      "api/routerName"{ // api/artists
        get:[1,2,3,4]
      }
      */
     
    if (Array.isArray(properties?.POST)) { // робота вже з існуючим масивом, тому defineMetadata не всередині блоку кода
      properties.POST.push(propertyKey);
      console.log("getPush.ts")
    } else {
      console.log("getElsePost.ts")
      properties = {
        ...properties,
        POST: [propertyKey]
      };

      Reflect.defineMetadata(routeName, properties, target); // оскільки POST масив лише треба створити - цей рядок є частиною коду
    }
  };
}