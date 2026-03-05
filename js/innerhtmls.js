/**
 * BiTask - Manual de Usuario [Oso de Anteojos Edition]
 * Contenido en formato HTML para inyección dinámica.
 */
const BITASK_MANUAL = `
<div class="manual-content" style="font-family: 'JetBrains Mono', monospace; padding: 20px; line-height: 1.6; color: #a9b7c6; background-color: #2b2b2b;">
    <h2 style="color: #a9b7c6; border-bottom: 1px solid #555; padding-bottom: 10px;">📖 BiTask Documentation v1.0</h2>
    <section style="background: #3c3f41; padding: 15px; border-radius: 4px; margin-top: 15px; border-left: 4px solid #cc7832;">
        <h4 style="color: #cc7832; margin: 0 0 10px 0;">💡 Nota del Sistema</h4>
        <p style="font-size: 13px; margin: 0;">La ventana principal de vistas es <strong>taskcontroller.js</strong>. Si quieres comenzar a planear tus tareas, puedes cambiar allí con <span class="keyword">Alt + 1</span> o directamente clicando en el explorador lateral.</p>
    </section>
    
    <section>
        <h3 style="color: #cc7832;">[1] Comandos de Terminal</h3>
        <p style="color: #808080;">// Todos los comandos deben empezar con /bitask</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
            <tr style="border-bottom: 1px solid #333; background-color: #3c3f41;">
                <th style="text-align: left; padding: 10px; color: #9876aa;">Acción</th>
                <th style="text-align: left; padding: 10px; color: #9876aa;">Flags Disponibles</th>
                <th style="text-align: left; padding: 10px; color: #9876aa;">Ejemplo</th>
            </tr>
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 10px;"><span class="keyword">Añadir</span></td>
                <td style="padding: 10px;"><span class="method">-a</span> | <span class="method">-add</span></td>
                <td style="padding: 10px;"><span class="string">/bitask -a "Tarea" -p alta</span></td>
            </tr>
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 10px;"><span class="keyword">Prioridad</span></td>
                <td style="padding: 10px;"><span class="method">-p</span> | <span class="method">-priority</span></td>
                <td style="padding: 10px;"><span class="comment">(alta | media | baja)</span></td>
            </tr>
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 10px;"><span class="keyword">Eliminar</span></td>
                <td style="padding: 10px;"><span class="method">-rm</span> | <span class="method">-remove</span></td>
                <td style="padding: 10px;"><span class="string">/bitask -rm 1</span></td>
            </tr>
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 10px;"><span class="keyword">Actualizar</span></td>
                <td style="padding: 10px;"><span class="method">-u</span> | <span class="method">-update</span></td>
                <td style="padding: 10px;"><span class="string">/bitask -u 1 -n "Nuevo"</span></td>
            </tr>
            <tr>
                <td style="padding: 10px;"><span class="keyword">Limpiar</span></td>
                <td style="padding: 10px;"><span class="method">clear</span></td>
                <td style="padding: 10px;"><span class="string">clear</span></td>
            </tr>
            <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 10px;"><span class="keyword">Ayuda</span></td>
                <td style="padding: 10px;"><span class="method">-h</span> | <span class="method">-help</span></td>
                <td style="padding: 10px;"><span class="string">/bitask -h</span></td>
            </tr>
        </table>
    </section>

    <section style="margin-top: 25px;">
        <h3 style="color: #cc7832;">[2] Navegación y Vistas</h3>
        <p>Puedes alternar entre archivos clicando en el explorador lateral o con Shortcuts:</p>
        <ul style="list-style: none; padding-left: 0;">
            <li style="margin-bottom: 10px;">📄 <span class="method">taskcontroller.js</span> <span class="comment">// Vista Principal (Editor de tareas)</span> → <span class="keyword">Alt + 1</span></li>
            <li style="margin-bottom: 10px;">📊 <span class="method">kanbanboard.js</span> <span class="comment">// Vista Kanban (Tablero)</span> → <span class="keyword">Alt + 2</span></li>
            <li style="margin-bottom: 10px;">📝 <span class="method">readme.md</span> <span class="comment">// Documentación del proyecto</span> → <span class="keyword">Alt + 3</span></li>
        </ul>
    </section>

    <section style="margin-top: 25px;">
        <h3 style="color: #cc7832;">[3] Shortcuts del Sistema</h3>
        <ul style="list-style: none; padding-left: 0;">
            <li style="margin-bottom: 10px;">⌨️ <span class="keyword">Alt + \`</span> (Tecla al lado del 1): <span class="method">Toggle Terminal</span> (Abrir/Cerrar).</li>
            <li style="margin-bottom: 10px;">⌨️ <span class="keyword">Ctrl + L</span>: <span class="method">Clear Terminal</span> (Limpiar consola).</li>
            <li style="margin-bottom: 10px;">⌨️ <span class="keyword">Alt + ↑</span>: <span class="method">Restore Last Command</span> (Recupera el ultimo comando en terminal).</li>
            <li style="margin-bottom: 10px;">⌨️ <span class="keyword">Enter</span>: Ejecutar comando o confirmar acción en GUI.</li>
        </ul>
    </section>

</div>
`;

const HELP_TERMINAL = `
<div style="color: #a9b7c6; line-height: 1.4;">
                <span style="color: #cc7832;">Uso:</span> /bitask [comando] [flags]<br><br>
                <span style="color: #9876aa;">-a, -add</span> <span style="color: #6a8759;">"nombre"</span> -p <span style="color: #6a8759;">(prio)</span> <span style="color: #808080;">// Añadir</span><br>
                <span style="color: #9876aa;">-rm, -remove</span> <span style="color: #6a8759;">[id]</span> <span style="color: #808080;">// Eliminar</span><br>
                <span style="color: #9876aa;">-u, -update</span> <span style="color: #6a8759;">[id]</span> -n <span style="color: #6a8759;">"nuevo"</span> <span style="color: #808080;">// Editar</span><br>
                <span style="color: #9876aa;">-h, -help</span> <span style="color: #808080;">// Abrir manual completo</span><br>
                <span style="color: #cc7832;">clear</span> <span style="color: #808080;">// Limpiar terminal</span>
            </div>
`;

const BITASK_KANBAN = `
<div class="manual-content" style="font-family: 'JetBrains Mono', monospace; padding: 20px; line-height: 1.6; color: #a9b7c6; background-color: #2b2b2b;">
    <h3 style="color: #cc7832; margin-bottom: 10px;">Kanban</h3>
    <p style="color: #808080; margin: 0;">En próximas actualizaciones se añadirá la vista Kanban. Espérala con ansias.</p>
</div>
`;
