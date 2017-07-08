class Greetr{
    constructor(greet){
        this.greeting = 'Hello world';
    }
    greet(){
        console.log(this.greeting);
    }
}

module.exports = new Greetr();