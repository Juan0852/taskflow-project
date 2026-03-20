/**
 * BiTask - Manual de Usuario [Oso de Anteojos Edition]
 * Contenido en formato HTML para inyección dinámica.
 */


/*
Es verdad que se pudieron haber llamado desde el style.ccs pero... meh, esto es más directo y fácil de modificar sin tocar el css. 
Ademas, asi se pueden usar variables de color directamente desde JS sin necesidad de CSS custom properties.
*/
const TW = {
    baseText: 'text-[var(--color-text)]',
    keyword: 'text-[var(--color-code-keyword)]',
    method: 'text-[var(--color-code-method)]',
    string: 'text-[var(--color-code-string)]',
    comment: 'text-[var(--color-text-muted)]',
    accent: 'text-[var(--color-code-identifier)]',
    muted: 'text-[var(--color-text-dimmer)]'
};

const ICONS = {
    javaFile: `
        <img src="/assets/Java.png" alt="Java" class="mr-3 inline-block h-5 w-5 align-[-3px] [filter:var(--tree-java-filter)]">
    `,
    kanban: `
        <img src="/assets/Java.png" alt="Java" class="mr-3 inline-block h-5 w-5 align-[-3px] [filter:var(--tree-java-filter)]">
    `,
    readme: `
        <img src="/assets/Book.png" alt="Readme" class="mr-3 inline-block h-5 w-5 align-[-3px] [filter:var(--tree-readme-filter)]">
    `,
    settingsTrigger: `
        <span class="mr-3 inline-flex h-5 w-5 items-center justify-center align-[-3px] text-[var(--color-settings-icon)]">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3.75a2.25 2.25 0 0 1 2.2 1.79l.14.67a1.5 1.5 0 0 0 1.84 1.15l.67-.17a2.25 2.25 0 0 1 2.63 1.2 2.25 2.25 0 0 1-.4 2.86l-.5.48a1.5 1.5 0 0 0 0 2.16l.5.48a2.25 2.25 0 0 1 .4 2.86 2.25 2.25 0 0 1-2.63 1.2l-.67-.17a1.5 1.5 0 0 0-1.84 1.15l-.14.67a2.25 2.25 0 0 1-4.4 0l-.14-.67a1.5 1.5 0 0 0-1.84-1.15l-.67.17a2.25 2.25 0 0 1-2.63-1.2 2.25 2.25 0 0 1 .4-2.86l.5-.48a1.5 1.5 0 0 0 0-2.16l-.5-.48a2.25 2.25 0 0 1-.4-2.86 2.25 2.25 0 0 1 2.63-1.2l.67.17a1.5 1.5 0 0 0 1.84-1.15l.14-.67A2.25 2.25 0 0 1 12 3.75Z" />
                <circle cx="12" cy="12" r="2.75" />
            </svg>
        </span>
    `,
    keyboard: `
        <img src="/assets/Keyboard.svg" alt="Keyboard" class="mr-3 inline-block h-6 w-6 align-[-4px]">
    `
};

export const BITASK_MANUAL = `
<div class="manual-content bg-[var(--color-bg-base)] p-5 font-['JetBrains_Mono',monospace] leading-[1.6] ${TW.baseText}">
    <h2 class="border-b border-solid border-[var(--color-text-dim)] pb-[10px] ${TW.baseText}">📖 BiTask Documentation v1.0</h2>
    <section class="mt-[15px] rounded bg-[var(--color-bg-surface)] p-[15px] border-l-4 border-solid border-[var(--color-code-keyword)]">
        <h4 class="mb-[10px] ${TW.keyword}">💡 Nota del Sistema</h4>
        <p class="m-0 text-[13px]">La ventana principal de vistas es <strong>taskcontroller.java</strong>. Si quieres comenzar a planear tus tareas, puedes cambiar allí con <span class="keyword ${TW.keyword}">Alt + 1</span> o directamente clicando en el explorador lateral.</p>
    </section>
    
    <section>
        <h3 class="${TW.keyword}">[1] Comandos de Terminal</h3>
        <p class="${TW.muted}">// Todos los comandos deben empezar con /bitask</p>

        <h4 class="mb-[10px] ${TW.accent}">COMANDO ADD Y SUS FLAGS</h4>
        
        <div class="mb-5 overflow-hidden rounded-md border border-solid border-[var(--color-border-strong)]">
        <table class="w-full border-collapse text-[13px]">
            <tr class="border-b border-solid border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
                <th class="p-[10px] text-left ${TW.accent}">Flag</th>
                <th class="p-[10px] text-left ${TW.accent}">Uso</th>
                <th class="p-[10px] text-left ${TW.accent}">Ejemplo</th>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]"><span class="method ${TW.method}">-a</span> | <span class="method ${TW.method}">-add</span></td>
                <td class="p-[10px]">Activa la creacion de una nueva tarea.</td>
                <td class="p-[10px]"><span class="string ${TW.string}">/bitask -a "Estudiar Tailwind"</span></td>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]"><span class="method ${TW.method}">-p</span> | <span class="method ${TW.method}">-priority</span></td>
                <td class="p-[10px]">Define la prioridad de la tarea. Si no se indica por GUI, queda en <span class="${TW.string}">media</span>.</td>
                <td class="p-[10px]"><span class="string ${TW.string}">-p alta</span></td>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]"><span class="method ${TW.method}">-t</span> | <span class="method ${TW.method}">-type</span></td>
                <td class="p-[10px]">Define el tipo de tarea. Si no se indica, se guarda como <span class="${TW.string}">general</span>.</td>
                <td class="p-[10px]"><span class="string ${TW.string}">-t "estudio"</span></td>
            </tr>
            <tr>
                <td class="p-[10px]"><span class="method ${TW.method}">-s</span> | <span class="method ${TW.method}">-status</span></td>
                <td class="p-[10px]">Define el estado inicial. Si no se indica, queda en <span class="${TW.string}">pendiente</span>.</td>
                <td class="p-[10px]"><span class="string ${TW.string}">-s haciendo</span></td>
            </tr>
        </table>
        </div>

        <div class="mb-5 rounded-md border border-solid border-[var(--color-border-strong)] bg-[var(--color-bg-surface)] p-[14px] text-[13px]">
            <p class="m-0 mb-2 ${TW.accent}">Ejemplo completo de creación</p>
            <p class="m-0 ${TW.baseText}">
                <span class="string ${TW.string}">/bitask -add "Preparar demo del calendario" -priority alta -type "trabajo" -status haciendo</span>
            </p>
            <p class="m-0 mt-2 ${TW.comment}">// Crea una tarea con nombre, prioridad, tipo y estado inicial.</p>
        </div>

        <h4 class="mb-[10px] ${TW.accent}">COMANDO UPDATE Y SUS FLAGS</h4>

        <div class="mb-5 overflow-hidden rounded-md border border-solid border-[var(--color-border-strong)]">
        <table class="w-full border-collapse text-[13px]">
            <tr class="border-b border-solid border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
                <th class="p-[10px] text-left ${TW.accent}">Flag</th>
                <th class="p-[10px] text-left ${TW.accent}">Uso</th>
                <th class="p-[10px] text-left ${TW.accent}">Ejemplo</th>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]"><span class="method ${TW.method}">-u</span> | <span class="method ${TW.method}">-update</span></td>
                <td class="p-[10px]">Activa la actualizacion parcial de una tarea existente, indicando primero su ID.</td>
                <td class="p-[10px]"><span class="string ${TW.string}">/bitask -u 1</span></td>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]"><span class="method ${TW.method}">-n</span></td>
                <td class="p-[10px]">Cambia unicamente el nombre/texto de la tarea.</td>
                <td class="p-[10px]"><span class="string ${TW.string}">-n "Nuevo nombre"</span></td>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]"><span class="method ${TW.method}">-p</span></td>
                <td class="p-[10px]">Cambia unicamente la prioridad.</td>
                <td class="p-[10px]"><span class="string ${TW.string}">-p alta</span></td>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]"><span class="method ${TW.method}">-t</span> | <span class="method ${TW.method}">-type</span></td>
                <td class="p-[10px]">Cambia unicamente el tipo de tarea.</td>
                <td class="p-[10px]"><span class="string ${TW.string}">-t "trabajo"</span></td>
            </tr>
            <tr>
                <td class="p-[10px]"><span class="method ${TW.method}">-s</span> | <span class="method ${TW.method}">-status</span></td>
                <td class="p-[10px]">Cambia unicamente el estado de la tarea.</td>
                <td class="p-[10px]"><span class="string ${TW.string}">-s completado</span></td>
            </tr>
        </table>
        </div>

        <h4 class="mb-[10px] ${TW.accent}">OTROS COMANDOS</h4>

        <div class="mb-5 overflow-hidden rounded-md border border-solid border-[var(--color-border-strong)]">
        <table class="w-full border-collapse text-[13px]">
            <tr class="border-b border-solid border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
                <th class="p-[10px] text-left ${TW.accent}">Acción</th>
                <th class="p-[10px] text-left ${TW.accent}">Flags Disponibles</th>
                <th class="p-[10px] text-left ${TW.accent}">Ejemplo</th>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]"><span class="keyword ${TW.keyword}">Eliminar</span></td>
                <td class="p-[10px]"><span class="method ${TW.method}">-rm</span> | <span class="method ${TW.method}">-remove</span></td>
                <td class="p-[10px]"><span class="string ${TW.string}">/bitask -rm 1</span></td>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]"><span class="keyword ${TW.keyword}">Completar todas</span></td>
                <td class="p-[10px]"><span class="method ${TW.method}">-ca</span> | <span class="method ${TW.method}">-completeAll</span></td>
                <td class="p-[10px]"><span class="string ${TW.string}">/bitask -ca</span></td>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]"><span class="keyword ${TW.keyword}">Borrar todas</span></td>
                <td class="p-[10px]"><span class="method ${TW.method}">-cla</span> | <span class="method ${TW.method}">-clearAll</span></td>
                <td class="p-[10px]"><span class="string ${TW.string}">/bitask -cla</span></td>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]"><span class="keyword ${TW.keyword}">Borrar completadas</span></td>
                <td class="p-[10px]"><span class="method ${TW.method}">-clc</span> | <span class="method ${TW.method}">-clearCompleted</span></td>
                <td class="p-[10px]"><span class="string ${TW.string}">/bitask -clc</span></td>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]"><span class="keyword ${TW.keyword}">Configurar UI</span></td>
                <td class="p-[10px]"><span class="method ${TW.method}">-cfg</span> | <span class="method ${TW.method}">-config</span></td>
                <td class="p-[10px]"><span class="string ${TW.string}">/bitask -cfg button edit on</span></td>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]"><span class="keyword ${TW.keyword}">Limpiar</span></td>
                <td class="p-[10px]"><span class="method ${TW.method}">clear</span></td>
                <td class="p-[10px]"><span class="string ${TW.string}">clear</span></td>
            </tr>
            <tr>
                <td class="p-[10px]"><span class="keyword ${TW.keyword}">Ayuda</span></td>
                <td class="p-[10px]"><span class="method ${TW.method}">-h</span> | <span class="method ${TW.method}">-help</span></td>
                <td class="p-[10px]"><span class="string ${TW.string}">/bitask -h</span></td>
            </tr>
        </table>
        </div>
    </section>

    <section class="mt-[25px]">
        <h3 class="${TW.keyword}">[2] Personalización por terminal</h3>
        <div class="mb-5 overflow-hidden rounded-md border border-solid border-[var(--color-border-strong)]">
        <table class="w-full border-collapse text-[13px]">
            <tr class="border-b border-solid border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
                <th class="p-[10px] text-left ${TW.accent}">Objetivo</th>
                <th class="p-[10px] text-left ${TW.accent}">Ejemplo</th>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]">Mostrar u ocultar botones del IDE</td>
                <td class="p-[10px]"><span class="string ${TW.string}">/bitask -cfg button edit on</span></td>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]">Listar todos los botones configurables</td>
                <td class="p-[10px]"><span class="string ${TW.string}">/bitask config buttons list</span></td>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]">Mostrar u ocultar toda la zona de filtros</td>
                <td class="p-[10px]"><span class="string ${TW.string}">/bitask config filters row off</span></td>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]">Activar o apagar el filtro por nombre</td>
                <td class="p-[10px]"><span class="string ${TW.string}">/bitask -cfg filter name off</span></td>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]">Listar filtros configurables</td>
                <td class="p-[10px]"><span class="string ${TW.string}">/bitask config filters list</span></td>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]">Activar o apagar filtros por tipo</td>
                <td class="p-[10px]"><span class="string ${TW.string}">/bitask -cfg filter types on</span></td>
            </tr>
            <tr class="border-b border-solid border-[var(--color-border-subtle)]">
                <td class="p-[10px]">Permitir más de un criterio de orden</td>
                <td class="p-[10px]"><span class="string ${TW.string}">/bitask -cfg filter multiSort on</span></td>
            </tr>
            <tr>
                <td class="p-[10px]">Mostrar u ocultar el calendario lateral</td>
                <td class="p-[10px]"><span class="string ${TW.string}">/bitask config calendar off</span></td>
            </tr>
        </table>
        </div>

        <div class="rounded-md border border-solid border-[var(--color-border-strong)] bg-[var(--color-bg-surface)] p-[14px] text-[13px]">
            <p class="m-0 mb-2 ${TW.accent}">
                ${ICONS.settingsTrigger}
                Personalización desde el icono de configuración
            </p>
            <p class="m-0 leading-7 ${TW.baseText}">
                Desde el icono de configuración ubicado en la barra superior derecha puedes abrir el panel para personalizar visualmente el IDE:
                mostrar u ocultar botones, reorganizar cuáles aparecen, y ajustar el comportamiento de los filtros y del calendario lateral sin necesidad de escribir comandos.
            </p>
        </div>
    </section>

    <section class="mt-[25px]">
        <h3 class="${TW.keyword}">[3] Navegación y Vistas</h3>
        <p>Puedes alternar entre archivos clicando en el explorador lateral o con Shortcuts:</p>
        <ul class="list-none pl-0">
            <li class="mb-[10px]">${ICONS.javaFile}<span class="method ${TW.method}">taskcontroller.java</span> <span class="comment ${TW.comment}">// Vista Principal (Editor de tareas)</span> → <span class="keyword ${TW.keyword}">Alt + 1</span></li>
            <li class="mb-[10px]">${ICONS.kanban}<span class="method ${TW.method}">kanbanboard.java</span> <span class="comment ${TW.comment}">// Vista Kanban (Tablero)</span> → <span class="keyword ${TW.keyword}">Alt + 2</span></li>
            <li class="mb-[10px]">${ICONS.readme}<span class="method ${TW.method}">readme.md</span> <span class="comment ${TW.comment}">// Documentación del proyecto</span> → <span class="keyword ${TW.keyword}">Alt + 3</span></li>
        </ul>
    </section>

    <section class="mt-[25px]">
        <h3 class="${TW.keyword}">[4] Shortcuts del Sistema</h3>
        <ul class="list-none pl-0">
            <li class="mb-[10px]">${ICONS.keyboard}<span class="accent ${TW.accent}">Alt + \`</span> (Tecla al lado del 1): <span class="method ${TW.method}">Toggle Terminal</span> (Abrir/Cerrar).</li>
            <li class="mb-[10px]">${ICONS.keyboard}<span class="accent ${TW.accent}">Ctrl + L</span>: <span class="method ${TW.method}">Clear Terminal</span> (Limpiar consola).</li>
            <li class="mb-[10px]">${ICONS.keyboard}<span class="accent ${TW.accent}">Alt + ↑</span>: <span class="method ${TW.method}">Restore Last Command</span> (Recupera el ultimo comando en terminal).</li>
            <li class="mb-[10px]">${ICONS.keyboard}<span class="accent ${TW.accent}">Enter</span>: Ejecutar comando o confirmar acción en GUI.</li>
        </ul>
    </section>

</div>
`;

export const HELP_TERMINAL = `
<div class="leading-[1.4] ${TW.baseText}">
                <span class="${TW.keyword}">Uso:</span> /bitask [comando] [flags]<br><br>
                <span class="${TW.accent}">-a, -add</span> <span class="${TW.string}">"nombre"</span> -p <span class="${TW.string}">(alta | media | baja)</span> -t <span class="${TW.string}">"tipo"</span> -s <span class="${TW.string}">(pendiente | haciendo | completado)</span> <span class="${TW.muted}">// Añadir</span><br>
                <span class="${TW.string}">/bitask -add "Preparar demo del calendario" -priority alta -type "trabajo" -status haciendo</span> <span class="${TW.muted}">// Ejemplo completo</span><br>
                <span class="${TW.accent}">-rm, -remove</span> <span class="${TW.string}">[id]</span> <span class="${TW.muted}">// Eliminar</span><br>
                <span class="${TW.accent}">-u, -update</span> <span class="${TW.string}">[id]</span> -n <span class="${TW.string}">"nuevo nombre"</span> -t <span class="${TW.string}">"tipo"</span> -s <span class="${TW.string}">(pendiente | haciendo | completado)</span> <span class="${TW.muted}">// Editar</span><br>
                <span class="${TW.accent}">-ca, -completeAll</span> <span class="${TW.muted}">// Completar todas las tareas</span><br>
                <span class="${TW.accent}">-cla, -clearAll</span> <span class="${TW.muted}">// Borrar todas las tareas</span><br>
                <span class="${TW.accent}">-clc, -clearCompleted</span> <span class="${TW.muted}">// Borrar tareas completadas</span><br>
                <span class="${TW.accent}">-cfg, -config, config, configuraciones</span> <span class="${TW.string}">buttons|filters|calendar</span> <span class="${TW.string}">...</span> <span class="${TW.muted}">// Personalizar la UI</span><br>
                <span class="${TW.string}">/bitask config buttons list</span> <span class="${TW.muted}">// Descubrir botones</span><br>
                <span class="${TW.string}">/bitask config filters row off</span> <span class="${TW.muted}">// Ocultar la fila de filtros</span><br>
                <span class="${TW.accent}">-h, -help</span> <span class="${TW.muted}">// Abrir manual completo</span><br>
                <span class="${TW.keyword}">clear</span> <span class="${TW.muted}">// Limpiar terminal</span>
            </div>
`;

export const BITASK_KANBAN = `
<div class="manual-content bg-[var(--color-bg-base)] p-5 font-['JetBrains_Mono',monospace] leading-[1.6] ${TW.baseText}">
    <h3 class="mb-[10px] ${TW.keyword}">Kanban</h3>
    <p class="m-0 ${TW.muted}">En próximas actualizaciones se añadirá la vista Kanban. Espérala con ansias.</p>
</div>
`;
