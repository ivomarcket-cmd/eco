const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

// Remove Auth Row completely
content = content.replace(/<!-- Auth row \(siempre visible\) -->[\s\S]*?<!-- DASHBOARD WRAP \(Hidden until auth\) -->/g, '<!-- DASHBOARD WRAP (Hidden until auth) -->');

// Remove dashboard wrap logic
content = content.replace(/<div id="dashboard-wrap" style="display:none">/g, '');
content = content.replace(/<\/div> <!-- end dashboard-wrap -->/g, '');

// Simplify getPassword
content = content.replace(/function getPassword\(\) \{[^\}]+\}/g, 'function getPassword() { return ""; }');

// Simplify savePassword
content = content.replace(/function savePassword\(\) \{[\s\S]*?setDebug[^;]+;/g, 'function savePassword() {');

// Remove loadConfig auth logic
content = content.replace(/const pw = getPassword\(\);[\s\S]*?cache: "no-store",[\s\S]*?headers: pw \? \{ "x-admin-password": pw \} : \{\}/g, 'const res = await fetch("/api/config", {\n          cache: "no-store"');
content = content.replace(/if \(!res\.ok\) \{[\s\S]*?throw new Error\(errData\.error \|\| "Contraseña incorrecta o error de red\."\);/g, 'if (!res.ok) {\n          const errData = await res.json().catch(() => ({}));\n          throw new Error(errData.error || "No autorizado o error de red.");');
content = content.replace(/document\.getElementById\("dashboard-wrap"\)\.style\.display = "block";/g, '');
content = content.replace(/document\.getElementById\("auth-row"\)\.style\.display = "none";/g, '');
content = content.replace(/document\.getElementById\("dashboard-wrap"\)\.style\.display = "none";/g, '');
content = content.replace(/document\.getElementById\("auth-row"\)\.style\.display = "block";/g, '');
content = content.replace(/setAuthStatus[^\n]+/g, '');

// Strip x-admin-password from all fetches
content = content.replace(/headers:\s*\{\s*"Content-Type":\s*"application\/json",\s*"x-admin-password":\s*pw\s*\}/g, 'headers: { "Content-Type": "application/json" }');
content = content.replace(/headers:\s*\{\s*"Content-Type":\s*"application\/json",\s*"x-admin-password":\s*getPassword\(\)\s*\}/g, 'headers: { "Content-Type": "application/json" }');
content = content.replace(/headers:\s*\{\s*"x-admin-password":\s*pw\s*\}/g, 'headers: {}');

// Update init block
content = content.replace(/document\.getElementById\("load-btn"\)[\s\S]*?window\.addEventListener\("DOMContentLoaded", \(\) => \{[\s\S]*?\}\);/g, 'window.addEventListener("DOMContentLoaded", () => {\n      loadConfig();\n    });');

// Remove password elements references
content = content.replace(/const passwordEl = document\.getElementById\("admin-password"\);/g, '');
content = content.replace(/const authStatus = document\.getElementById\("auth-status"\);/g, '');

fs.writeFileSync('admin.html', content);
