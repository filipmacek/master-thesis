class Timestamp {
    constructor(string) {
        this.seconds = parseInt(this.getSeconds(string))
        this.minutes = parseInt(this.getMinutes(string))
        this.hours = parseInt(this.getHours(string))
    }

    getSeconds(s){
        const index= this.getPosition(s,':',2)
        let tmp = s.substring(index+1,index+3)
        if(tmp[0]==='0'){tmp=tmp.substring(1,tmp.length)}
        return tmp

    }
    getMinutes(s){
        const index = this.getPosition(s,":",1)
        let tmp = s.substring(index+1,index+3)
        if(tmp[0]==='0'){tmp=tmp.substring(1,tmp.length)}
        return tmp


    }
    getHours(s){
        return s.substring(0,s.indexOf(':'))

    }
    getPosition(string, subString, index) {
        return string.split(subString, index).join(subString).length;
    }

    subSeconds(tmp){
        let secondsDiff=0
        let minutesMinus=0

        let minutesDiff=0
        let hoursMinus=0

        let hoursDiff=0
        // seconds
        if( this.seconds < tmp.seconds){
            secondsDiff = (60 + this.seconds - tmp.seconds)
            minutesMinus =1
        }else{
            secondsDiff = this.seconds -  tmp.seconds
        }

        //minutes
        if(this.minutes < tmp.minutes){
            minutesDiff = (60+this.minutes - tmp.minutes) - minutesMinus
            hoursMinus =1
        }else{
            minutesDiff = this.minutes -tmp.minutes -minutesMinus
        }
        hoursDiff = this.hours-tmp.hours-hoursMinus



        return hoursDiff*60*60
            +minutesDiff*60
            +secondsDiff
    }


}


module.exports = {
    Timestamp
}