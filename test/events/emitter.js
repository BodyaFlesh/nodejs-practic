class Emitter{
    construstor(){
        this.events = {};
    }
    on(type, listener){
        if(this.events[type]){
            this.events[type] = this.events[type]
        }else{
            this.events[type] = [];
        }
        
        this.events[type].push(listener);
    }
    emit(type){
        if(this.events[type]){
            this.events[type].forEach(function(listener){
                listener();
            });
        }
    }
}

module.exports = Emitter;