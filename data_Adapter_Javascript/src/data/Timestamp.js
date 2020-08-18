class Timestamp {
    constructor(string) {
        this.seconds = parseInt(this.getSeconds(string))
        this.minutes = parseInt(this.getMinutes(string))
        this.hours = parseInt(this.getHours(string))
    }

    getSeconds(s){
        console.log("s: "+s)
        const index= this.getPosition(s,':',2)
        console.log("index: "+index.toString())
        let tmp = s.substring(index+1,index+3)
        console.log("tmp: "+tmp.toString())
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
        return Math.abs(tmp.hours - this.hours)*60*60+Math.abs(tmp.minutes - this.minutes)*60+Math.abs(tmp.seconds-this.seconds)
    }


}
// const x = new Timestamp("12:12:14")
// const y = new Timestamp("12:12:27")
// console.log(x)
// console.log(y)
//
// console.log(x.subSeconds(y))

module.exports = {
    Timestamp
}