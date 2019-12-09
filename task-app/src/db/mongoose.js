const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
    useNewUrlParser: true,
    useCreateIndex: true
});

const User = mongoose.model("User", {
    name: {
        type: String
    },
    age: {
        type: Number
    }
});

const Taks = mongoose.model("task", {
    description: {
        type: String
    },
    completed: {
        type: Boolean
    }
});

const tast = new Taks({
    description: "test",
    completed: true
});

tast.save()
    .then(() => {
        console.log(me);
    })
    .catch(error => {
        console.log("Error!", error);
    });

const me = new User({
    name: "Andrew",
    age: 18
});

me.save()
    .then(() => {
        console.log(me);
    })
    .catch(error => {
        console.log("Error!", error);
    });
