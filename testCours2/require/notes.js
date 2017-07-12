console.log('Starting notes.js');

var addNote = (title, body) => {
    console.log('Adding nite', title, body);
};

var getAll = () => {
    console.log('Getting all notes');
};

var getNote = (title) => {
    console.log('Reading node', title);
};

var removeNote = (title) => {
    console.log('Remove note', title);
};

module.exports = {
    addNote,
    getAll,
    getNote,
    removeNote
};