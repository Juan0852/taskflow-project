/**
 * BiTask - Commands Dictionary
 * Define el mapeo de flags a códigos de acción.
 */
export const Commands = {
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
        // Accion 5: CLEAR TERMINAL
        'clear': () => 5,
        // Accion 6: COMPLETE ALL TASKS
        '-completeall': () => 6,
        '-ca':          () => 6,
        // Accion 7: CLEAR ALL TASKS
        '-clearall': () => 7,
        '-cla':      () => 7,
        // Accion 8: CLEAR COMPLETED TASKS
        '-clearcompleted': () => 8,
        '-clc':            () => 8,
        // Accion 9: CONFIG
        '-config': () => 9,
        '-cfg':    () => 9,
        ' config': () => 9,
        ' configuraciones': () => 9
    }
};
