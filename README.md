
Autenticación
El sistema implementa autenticación basada en JWT.
Los usuarios pueden registrarse mediante /auth/register y autenticarse con /auth/login.
Las rutas protegidas utilizan JwtAuthGuard, permitiendo obtener la información del usuario autenticado a través de /auth/me, sin exponer la contraseña.

