export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // Proteger /admin.html y /admin con Basic Auth nativo del navegador
  if (url.pathname === '/admin' || url.pathname === '/admin.html') {
    const authHeader = request.headers.get('Authorization');
    const expectedPassword = env.ADMIN_PASSWORD || "admin123";
    const expectedUser = "admin";

    if (!authHeader) {
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Acceso Privado"',
          'Content-Type': 'text/plain'
        }
      });
    }

    try {
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = atob(base64Credentials);
      const [username, password] = credentials.split(':');

      if (username !== expectedUser || password !== expectedPassword) {
        return new Response('Unauthorized', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Acceso Privado"',
            'Content-Type': 'text/plain'
          }
        });
      }
    } catch (e) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  return next();
}
