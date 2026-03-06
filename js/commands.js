/**
 * BiTask - Commands Dictionary
 * Define el mapeo de flags a códigos de acción.
 */
const Commands = {
    registry: {
        // Accion 1: ADD
        '-add': () => 1,
        '-a':   () => 1,
        // Accion 2: REMOVE
        '-remove': () => 2,
        '-rm':     () => 2,
        // Accion 3: UPDATE
        '-update': () => 3,
        '-u':      () => 3,
        // Accion 4: HELP
        '-help': () => 4,
        '-h':    () => 4,
        // Accion 5: CLEAR
        'clear': () => 5
    }
};