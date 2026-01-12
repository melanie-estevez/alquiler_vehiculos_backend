Instalacion de dependencias
Antes de comenzar con la creacion de las tablas es importante instalar esta dependencia para que el backend no coloque ningun 
error al ejecutar el programa, la dependencia que debemos instalar es la siguiente

npm install

Una vez que este instalado esto obtendra todas las dependencias que necesitara para el backend.
Clonar el Repositorio
Es importante clonar el repositorio en donde se esta trabajando el proyecto para obtener las tablas que estaremos trabajando
y para eso ocupamos de los siguientes comandos

git clone https://github.com/tuusuario/proyecto-backend.git
y para entrar se debe uusar este comando
cd proyecto-backend
luego dentro del proyecto se deberan de instalar las dependencias que fueron mencionadas anteriormente dentro de ella,
una vez obtenido el backend del repositorio de github debemos crear un archivo .env para configurar las variables de postgreSQL
y MongoDB para postgres se debe configurar estos parametros:

DB_HOST=localhost
DB_PORT= tu_puerto
DB_USER= tu_usuario
DB_PASS=1234
DB_NAME= db_alquiler_vehiculos

Y para MongoDB se debe configurar lo siguiente:

MONGO_URI=mongodb://localhost:27017/alquiler_vehiculos

Luego debemos levantar las bases y para comprobar que todo este funcionando debemos usar el comando:

npm run start :dev

con este comando comprobara si el programa funciona con normalidad o tiene algun defecto
Tablas
Backend - alquileres
Para la creacion de esta tabla debemos crear el archivo alquileres y con ella trabajaremos para las tablas,
dentro debemos tener 4 importantes archivos el alquiler.controller, alquiler.module, alquiler.entity y alquiler.service, con ellos
tenemos el funcionamiento principal del programa,luego creamos una carpeta llamado dto que usaremos el isstring, isnumber, isdate, dependiendo del tipo de parametro, para que al momento de correrlo en el postman, este programa ejecute un cierto valor o dato en
especifico, tendra 2 archivos unos para crear y otro para actualizar, luego de haber hecho los ajustes necesarios usamos el comando de npm run start :dev para correr el programa,una vez ejecutado, debemos abrir nuestro pgadmin y comprobar que la base de datos tenga guardado la nueva tablaque agragamos.
Luego abrimos el postman y comprobamos que todo funcione correctamente, una vez que comrprobemos que el programa
puede recibir informacion, debemos abrir el MongoDb para corroborar que lo que colocamos en el postman se guarda a la 
base y si lo hace, hemos terminado de implementar las tablas a la base de datos y estara listo para ser utilizado
Backend - auth
Para la creacion de esta tabla debemos crear el archivo auth y con ella trabajaremos para las tablas, dentro debemos tener 4 importantes archivos el auth.controller, auth.module, auth.entity, auth.service y jwt.strategy, con ellos tenemos el funcionamiento principal del programa,luego creamos una carpeta llamado dto que usaremos para que al momento de autenticarse esta solo pida el correo y la contraseña,luego creamos otra carpeta llamada enums, que sera util para dar roles a los distintos usuarios, desde los admins hasta el usuario corriente y por ultimo creamos el archivo guards para proteger los datos, luego de haber hecho los ajustes necesarios usamos el comando de npm run start :dev para correr el programa,una vez ejecutado, debemos abrir nuestro pgadmin y comprobar que la base de datos tenga guardado la nueva tabla que agragamos.
Luego abrimos el postman y comprobamos que todo funcione correctamente, una vez que comrprobemos que el programa
puede recibir informacion, debemos abrir el MongoDb para corroborar que lo que colocamos en el postman se guarda a la 
base y si lo hace, hemos terminado de implementar las tablas a la base de datos y estara listo para ser utilizado
Backend - clientes
Para la creacion de esta tabla debemos crear el archivo clientes y con ella trabajaremos para las tablas,
dentro debemos tener 4 importantes archivos el clientes.controller, clientes.module, clientes.entity y clientes.service, con ellos
tenemos el funcionamiento principal del programa,luego creamos una carpeta llamado dto que usaremos el isstring, isnumber, isdate, dependiendo del tipo de parametro, para que al momento de correrlo en el postman, este programa ejecute un cierto valor o dato en
especifico, tendra 2 archivos unos para crear y otro para actualizar, luego de haber hecho los ajustes necesarios usamos el comando de npm run start :dev para correr el programa,una vez ejecutado, debemos abrir nuestro pgadmin y comprobar que la base de datos tenga guardado la nueva tablaque agragamos.
Luego abrimos el postman y comprobamos que todo funcione correctamente, una vez que comrprobemos que el programa
puede recibir informacion, debemos abrir el MongoDb para corroborar que lo que colocamos en el postman se guarda a la 
base y si lo hace, hemos terminado de implementar las tablas a la base de datos y estara listo para ser utilizado
Backend - common
Backend - Historial_reservas
Para la creacion de esta tabla debemos crear el archivo historial_reservas y con ella trabajaremos para las tablas,
dentro debemos tener 3 importantes archivos el historial.controller, historial.module e historial.service, con ellos
tenemos el funcionamiento principal del programa, luego de eso agragamos una carpeta schemas para colocar nuestros
parametros, por ejemplo id,estado y fecha, luego creamos una carpeta llamado dto que tendra los mismos parametros que schemas 
pero a diferencia de ellas es que en vez de colocar props, usamos el isstring, isnumber, isdate, dependiendo del tipo
de parametro, esto servira para que al momento de correrlo en el postman, este programa ejecute un cierto valor o dato en
especifico, tendra 2 archivos unos para crear y otro para actualizar, luego de haber hecho los ajustes necesarios usamos el comando de npm run start :dev para correr el programa,una vez ejecutado, debemos abrir nuestro pgadmin y comprobar que la base de datos tenga guardado la nueva tablaque agragamos.
Luego abrimos el postman y comprobamos que todo funcione correctamente, una vez que comrprobemos que el programa
puede recibir informacion, debemos abrir el MongoDb para corroborar que lo que colocamos en el postman se guarda a la 
base y si lo hace, hemos terminado de implementar las tablas a la base de datos y estara listo para ser utilizado
Backend - Historial_usuario
Para la creacion de esta tabla debemos crear el archivo historial_usuario , dentro debemos tener 3 archivos el historial_usuario.controller, historial_usuario.module e historial_usuario.service, con ellos tenemos el funcionamiento principal del programa, luego de eso agragamos una carpeta schemas para colocar nuestros parametros, por ejemplo id,accion y fecha, luego creamos una carpeta llamado dto que tendra los mismos parametros que schemas pero en ellas en vez de colocar props, usamos el isstring, isnumber, isdate, dependiendo del tipo de parametro utilizado, si lo hicieron todo bien este programa ejecutara un cierto valor o dato en especifico,  tendra 2 archivos unos para crear y otro para actualizar, luego de haber hecho los ajustes necesarios usamos el comando de npm run start :dev para correr el programa,una vez ejecutado, debemos abrir nuestro pgadmin y comprobar que la base de datos tenga guardado la nueva tabla que agragamos.
Luego abrimos el postman y comprobamos que todo funcione correctamente, una vez que comrprobemos que el programa puede recibir la informacion que le proporsionamos, debemos abrir el MongoDb para corroborar que lo que colocamos en el postman se guarda a la base y si lo hace, hemos terminado de implementar las tablas a la base de datos y estara listo para ser utilizado  
Backend - mantenimientos
Para la creacion de esta tabla debemos crear el archivo mantenimientos y con ella trabajaremos para las tablas,
dentro debemos tener 4 importantes archivos el mantenimientos.controller, mantenimientos.module, mantenimientos.entity y mantenimientos.service, con ellos tenemos el funcionamiento principal del programa,luego creamos una carpeta llamado dto que usaremos el isstring, isnumber, isdate, dependiendo del tipo de parametro, para que al momento de correrlo en el postman, este programa ejecute un cierto valor o dato en especifico, tendra 2 archivos unos para crear y otro para actualizar, luego de haber hecho los ajustes necesarios usamos el comando de npm run start :dev para correr el programa,una vez ejecutado, debemos abrir nuestro pgadmin y comprobar que la base de datos tenga guardado la nueva tablaque agragamos.
Luego abrimos el postman y comprobamos que todo funcione correctamente, una vez que comrprobemos que el programa
puede recibir informacion, debemos abrir el MongoDb para corroborar que lo que colocamos en el postman se guarda a la 
base y si lo hace, hemos terminado de implementar las tablas a la base de datos y estara listo para ser utilizado
Backend - pagos
Para la creacion de esta tabla debemos crear el archivo pagos y con ella trabajaremos para las tablas,
dentro debemos tener 4 importantes archivos el pagos.controller, pagos.module, pagos.entity y paogs.service, con ellos
tenemos el funcionamiento principal del programa,luego creamos una carpeta llamado dto que usaremos el isstring, isnumber, isdate, dependiendo del tipo de parametro, para que al momento de correrlo en el postman, este programa ejecute un cierto valor o dato en
especifico, tendra 2 archivos unos para crear y otro para actualizar, luego de haber hecho los ajustes necesarios usamos el comando de npm run start :dev para correr el programa,una vez ejecutado, debemos abrir nuestro pgadmin y comprobar que la base de datos tenga guardado la nueva tablaque agragamos.
Luego abrimos el postman y comprobamos que todo funcione correctamente, una vez que comrprobemos que el programa
puede recibir informacion, debemos abrir el MongoDb para corroborar que lo que colocamos en el postman se guarda a la 
base y si lo hace, hemos terminado de implementar las tablas a la base de datos y estara listo para ser utilizado
Backend - reservas
Para la creacion de esta tabla debemos crear el archivo reervas y con ella trabajaremos para las tablas,
dentro debemos tener 4 importantes archivos el reservas.controller, reservas.module, reservas.entity y reservas.service, con ellos
tenemos el funcionamiento principal del programa,luego creamos una carpeta llamado dto que usaremos el isstring, isnumber, isdate, dependiendo del tipo de parametro, para que al momento de correrlo en el postman, este programa ejecute un cierto valor o dato en
especifico, tendra 2 archivos unos para crear y otro para actualizar, luego de haber hecho los ajustes necesarios usamos el comando de npm run start :dev para correr el programa,una vez ejecutado, debemos abrir nuestro pgadmin y comprobar que la base de datos tenga guardado la nueva tablaque agragamos.
Luego abrimos el postman y comprobamos que todo funcione correctamente, una vez que comrprobemos que el programa
puede recibir informacion, debemos abrir el MongoDb para corroborar que lo que colocamos en el postman se guarda a la 
base y si lo hace, hemos terminado de implementar las tablas a la base de datos y estara listo para ser utilizado
Backend - sucursales
Para la creacion de esta tabla debemos crear el archivo sucursales y con ella trabajaremos para las tablas,
dentro debemos tener 4 importantes archivos el sucursales.controller, sucursales.module, sucursales.entity y sucursales.service, con ellos tenemos el funcionamiento principal del programa,luego creamos una carpeta llamado dto que usaremos el isstring, isnumber, isdate, dependiendo del tipo de parametro, para que al momento de correrlo en el postman, este programa ejecute un cierto valor o dato en especifico, tendra 2 archivos unos para crear y otro para actualizar, luego de haber hecho los ajustes necesarios usamos el comando de npm run start :dev para correr el programa,una vez ejecutado, debemos abrir nuestro pgadmin y comprobar que la base de datos tenga guardado la nueva tablaque agragamos.
Luego abrimos el postman y comprobamos que todo funcione correctamente, una vez que comrprobemos que el programa
puede recibir informacion, debemos abrir el MongoDb para corroborar que lo que colocamos en el postman se guarda a la 
base y si lo hace, hemos terminado de implementar las tablas a la base de datos y estara listo para ser utilizado
Backend - users 
Para la creacion de esta tabla debemos crear el archivo users y con ella trabajaremos para las tablas,dentro debemos tener 4 importantes archivos el users.controller, users.module, users.entity y users.service, con ellostenemos el funcionamiento principal del programa,luego creamos una carpeta llamado dto que usaremos el isstring, isnumber, isdate, dependiendo del tipo de parametro, para que al momento de correrlo en el postman, este programa ejecute un cierto valor o dato en especifico, tendra 2 archivos unos para crear y otro para actualizar, luego de haber hecho los ajustes necesarios usamos el comando de npm run start :dev para correr el programa,una vez ejecutado, debemos abrir nuestro pgadmin y comprobar que la base de datos tenga guardado la nueva tablaque agragamos.
Luego abrimos el postman y comprobamos que todo funcione correctamente, una vez que comrprobemos que el programa
puede recibir informacion, debemos abrir el MongoDb para corroborar que lo que colocamos en el postman se guarda a la 
base y si lo hace, hemos terminado de implementar las tablas a la base de datos y estara listo para ser utilizado
Backend - vehiculos
Para la creacion de esta tabla debemos crear el archivo vehiculos y con ella trabajaremos para las tablas,dentro debemos tener 4 importantes archivos el vehiculos.controller, vehiculos.module, vehiculos.entity y vehiculos.service, con ellos
tenemos el funcionamiento principal del programa,luego creamos una carpeta llamado dto que usaremos el isstring, isnumber, isdate, dependiendo del tipo de parametro, para que al momento de correrlo en el postman, este programa ejecute un cierto valor o dato en
especifico, tendra 2 archivos unos para crear y otro para actualizar, luego creamos otra carpeta llamada enums, que con ella la usaremos para colocar el estado del vehiculo, ya sea si esta en buenas condiciones o en malas condiciones, luego de haber hecho los ajustes necesarios usamos el comando de npm run start :dev para correr el programa,una vez ejecutado, debemos abrir nuestro pgadmin y comprobar que la base de datos tenga guardado la nueva tablaque agragamos.
Luego abrimos el postman y comprobamos que todo funcione correctamente, una vez que comrprobemos que el programa
puede recibir informacion, debemos abrir el MongoDb para corroborar que lo que colocamos en el postman se gitguarda a la 
base y si lo hace, hemos terminado de implementar las tablas a la base de datos y estara listo para ser utilizado