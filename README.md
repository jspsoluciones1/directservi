# Plantilla Libre - Comparador de Tarifas Energéticas

Un sistema multi-inquilino para comparación de tarifas energéticas en España, construido con Node.js, Express y Supabase.

## Características

- **Multi-tenant**: Cada empresa puede tener su propia configuración y usuarios
- **Control de acceso basado en roles**: Superadmin, Admin, Vendedor, Tramitador
- **Comparador de tarifas**: Calcula automáticamente las mejores ofertas para cada cliente
- **Gestión completa**: Usuarios, proveedores, tarifas y propuestas
- **Personalización**: Cada empresa puede configurar sus colores y logo
- **Generación de PDF**: Propuestas profesionales en PDF

## Tecnologías

- **Backend**: Node.js + Express
- **Base de datos**: Supabase (PostgreSQL)
- **Frontend**: Bootstrap 5 + Vanilla JavaScript
- **Autenticación**: Supabase Auth
- **PDF**: jsPDF + AutoTable

## Instalación

1. **Clona el repositorio**
```bash
git clone <repository-url>
cd plantillalibre
```

2. **Instala dependencias**
```bash
npm install
```

3. **Configura variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase:
```
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
PORT=3000
NODE_ENV=development
```

4. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
src/
├── server.js              # Servidor principal
├── routes/                 # Rutas organizadas por rol
│   ├── auth.js
│   ├── superadmin.js
│   ├── admin.js
│   ├── vendedor.js
│   └── tramitador.js
├── services/
│   └── supabase.js        # Cliente y servicios de Supabase
├── templates/             # Plantillas HTML
│   ├── layout.js
│   └── pages/
├── utils/
│   ├── utils.js           # Utilidades generales
│   └── tariffCalculator.js # Lógica de cálculo de tarifas
└── public/                # Archivos estáticos
```

## Roles y Permisos

### Superadmin
- Gestiona todas las empresas y compañías
- Crea administradores para cada negocio
- Acceso completo al sistema

### Admin (Administrador de Negocio)
- Gestiona usuarios de su negocio (vendedores, tramitadores)
- Configura proveedores y tarifas
- Personaliza apariencia (colores, logo)

### Vendedor
- Utiliza el comparador de tarifas
- Genera propuestas para clientes
- Exporta propuestas a PDF

### Tramitador
- Gestiona el estado de contratos
- Procesa documentación
- Seguimiento de tramitaciones

## Base de Datos

El sistema requiere las siguientes tablas en Supabase:

- `companies` - Empresas/entidades legales
- `businesses` - Negocios/canales de venta
- `business_styles` - Configuración de apariencia
- `roles` - Roles del sistema
- `user_profiles` - Perfiles de usuario
- `providers` - Proveedores energéticos
- `rates` - Tarifas energéticas
- `proposals` - Propuestas generadas

## Desarrollo

Para desarrollo con recarga automática:
```bash
npm run dev
```

Para producción:
```bash
npm start
```

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.