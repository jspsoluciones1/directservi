import { escapeHTML } from '../../../utils/utils.js';

export const AdminStylesPage = (currentStyle = null, message = null) => {
    const messageHtml = message ? `<div class="alert alert-info">${escapeHTML(message)}</div>` : '';

    return `
        ${messageHtml}
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card shadow-sm">
                    <div class="card-header">
                        <h5 class="mb-0">Configuración de Apariencia</h5>
                    </div>
                    <div class="card-body">
                        <p class="text-muted">Personalice los colores y logo de su negocio.</p>
                        
                        <form method="POST" action="/admin/styles">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="primary_color" class="form-label">Color Primario</label>
                                    <input type="color" id="primary_color" name="primary_color" class="form-control form-control-color" 
                                           value="${escapeHTML(currentStyle?.primary_color || '#007bff')}">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="secondary_color" class="form-label">Color Secundario</label>
                                    <input type="color" id="secondary_color" name="secondary_color" class="form-control form-control-color" 
                                           value="${escapeHTML(currentStyle?.secondary_color || '#6c757d')}">
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="background_color" class="form-label">Color de Fondo</label>
                                <input type="color" id="background_color" name="background_color" class="form-control form-control-color" 
                                       value="${escapeHTML(currentStyle?.background_color || '#f8f9fa')}">
                            </div>
                            
                            <div class="mb-3">
                                <label for="logo_base64" class="form-label">Logo (URL o Base64)</label>
                                <textarea id="logo_base64" name="logo_base64" class="form-control" rows="3" 
                                          placeholder="Pegue aquí la URL del logo o código base64">${escapeHTML(currentStyle?.logo_base64 || '')}</textarea>
                                <div class="form-text">Puede usar una URL de imagen o código base64.</div>
                            </div>
                            
                            ${currentStyle?.logo_base64 ? `
                                <div class="mb-3">
                                    <label class="form-label">Vista previa del logo actual:</label>
                                    <div>
                                        <img src="${escapeHTML(currentStyle.logo_base64)}" alt="Logo actual" style="max-height: 60px;">
                                    </div>
                                </div>
                            ` : ''}
                            
                            <button type="submit" class="btn btn-primary">Guardar Configuración</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
};