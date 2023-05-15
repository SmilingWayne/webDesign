const { createApp } = Vue

createApp({  
    name :"minesweeper",
    data() {
        return {
            canvasWidth : 450,
            canvasHeight: 450,
            ctx : null,
            g_arr : [], 
            g_obj : {}, // record status
            g_color : { block : "#F29CB1" , open :  '#fff5f6', mine : "#f38c9c", hover : '#ggg', highlight: "#fa8072", warning: "#8E2323", supHightLight: "#00BFFF"}, // modify color
            f_color : ["#fff5f6", "#0000FF", "#2F4F2F", "#FF0000" , "#6B238E", "#FF7F00", "#4E2F2F", "#CC3299", "#5C3317" ],
            row : 9,
            col : 9,
            mines : 10,
            levels: [this.row, this.col, this.mines],
            icons : {mine : '💣', flag  : '🚩', uncertain :'❓' , failed:'💥' } ,
            countFlags : 0,
            win : false,
            mines_loc: []  ,
            seconds : 0,
            begin_clock : false, 
            time_clock : null,
        }
    },

    mounted(){
        this.init();
        this.$nextTick(() => {
            var TheCanvas = document.getElementById('canvas')
            TheCanvas.addEventListener('click', (event) => {
                if(!this.begin_clock){
                    this.begin_clock = true
                    this.time_clock = setInterval(() => {
                        this.seconds += 1
                    }, 1000)
                }
               
                let x = ~~(event.offsetX / 50);
                let y = ~~(event.offsetY / 50);
                let xy = x + '-' + y
                if(this.g_obj[xy].open != 0){
                    return;
                }
                this.g_obj[xy].open = 1;
                // console.log(x + " - " + y)
                this.drawBlock(xy, this.g_color.open);
                this.showEachInfo(xy, this.g_obj[xy].mark);
                if (this.g_obj[xy].mark == 0){
                    this.openZero(xy)
                }
                else if (this.g_obj[xy].mark == -1){
                    this.drawBlock(xy, this.g_color.warning);
                    this.showEachInfo(xy, this.icons.failed)
                    clearInterval(this.time_clock)
                    this.begin_clock = false
                    alert("挑战失败")
                }
            });
            
            TheCanvas.addEventListener('contextmenu', (event) => {
                event.preventDefault()
                let x = ~~(event.offsetX / 50);
                let y = ~~(event.offsetY / 50);
                let xy = x + '-' + y;
                console.log(xy)
                console.log(this.g_obj)
                if(this.g_obj[xy].open == 0){
                    this.g_obj[xy].open = -1;
                    this.countFlags += 1;
                    this.drawBlock(xy, this.g_color.highlight);
                    this.showEachInfo(xy, this.icons.flag)
                    if(this.countFlags == 10){
                        this.checkOver()
                    }
                }
                else if(this.g_obj[xy].open == -1){
                    this.g_obj[xy].open = 2;
                    this.countFlags -= 1;
                    this.drawBlock(xy, this.g_color.highlight);
                    this.showEachInfo(xy, this.icons.uncertain)
                }
                else if(this.g_obj[xy].open == 2){
                    this.g_obj[xy].open = 0;
                    this.drawBlock(xy, this.g_color.block);
                    this.showEachInfo(xy, "")
                }
            });


            // 高亮显示
            // TheCanvas.addEventListener('mousedown', (event) => {
            //     let x = ~~( event.offsetX / 50 )
            //     let y = ~~( event.offsetY / 50 )
            //     let xy = x + "-" + y
            //     if ( this.g_obj[xy].open != 1){
            //         return
            //     }
            //     this.getAround(xy).forEach(n => { 
            //         if(this.g_obj[n].open == 0){
            //             // continue
            //             this.drawBlock(n, this.g_color.supHightLight)
                       
                        
            //         }
            //     });
            // });

            // TheCanvas.addEventListener('mouseup' , (event) => {
            //     let x = ~~( event.offsetX / 50 )
            //     let y = ~~( event.offsetY / 50 )
            //     let xy = x + "-" + y
            //     if ( this.g_obj[xy].open != 1){
            //         return
            //     }
            //     this.getAround(xy).forEach(n => { 
            //         if(this.g_obj[n].open == 0){
            //             // continue
            //             this.drawBlock(n, this.g_color.block)
            //         }
            //     });
            // });

            TheCanvas.addEventListener('mousedown', (event) => { 
                let x = ~~( event.offsetX / 50 )
                let y = ~~( event.offsetY / 50 )
                let xy = x + "-" + y
                if ( this.g_obj[xy].open != 1){
                    return
                }
                let mark = this.g_obj[xy].mark
                let markedMine = 0
                let unopen = 0
                let around = this.getAround(xy)
                around.forEach(n => {
                    if(this.g_obj[n].open == -1){
                        markedMine += 1
                    }
                    if(this.g_obj[n].open == 0){
                        unopen += 1
                    }
                })
                around.forEach(n => {
                    if(this.g_obj[n].open == 0 ){
                        if(mark == markedMine && this.g_obj[n].mark != -1){
                            this.g_obj[n].open = 1
                            this.drawBlock(n, this.g_color.open)
                            this.showEachInfo(n, this.g_obj[n].mark)
                            if(this.g_obj[n].mark == 0){
                                this.openZero(n)
                            }
                        }
                        // TODO: 
                        // else if((mark - markedMine) == unopen ){
                        //     this.g_obj[n].open = -1;
                        //     this.drawBlock(n, this.g_color.highlight)
                        //     this.showEachInfo(n, this.icons.flag)
                        //     this.countFlags += 1
                        //     if(this.countFlags == 10){
                        //         this.checkOver()
                        //     }
                        // }
                    }
                })
            });
        })
    },
    computed(){
        
    },
    methods: {
     
        checkOver(){
            this.win = this.mines_loc.every(n => this.g_obj[n].mark == this.g_obj[n].open )
            
            setTimeout(() => {
                alert(this.win ? "成功！": "踩雷了！💣")
                clearInterval(this.time_clock)
                this.begin_clock = false
            }, 100)
            
        },
        init(){
            this.countFlags = 0;
            clearInterval(this.time_clock)
            this.begin_clock = false
            this.seconds = 0
            this.ctx = this.$refs.canvas05.getContext('2d') 
            for(let i = 0; i < this.row; i ++ ){
                for(let j = 0; j < this.col; j ++ ){
                    let xy = j + "-" + i;
                    this.g_arr.push(xy)
                    this.g_obj[xy] = { mark : 0, open : 0}
                    this.drawBlock(xy, this.g_color.block)
                }
            }
            this.setMines()
            
            // this.showInfo()
            
        },
        drawBlock(xy, c){
            let w = 50, r = 8, m = 1.5;
            let [x, y] = xy.split("-").map(n => n * w);
            this.ctx.save()
            this.ctx.beginPath()
            this.ctx.moveTo(x, y + r)
            this.ctx.arcTo(x, y + w - m, x + w - m, y + w - m, r)
            this.ctx.arcTo(x + w - m, y + w - m, x + w - m, y, r)
            this.ctx.arcTo(x + w - m, y , x, y, r)
            this.ctx.arcTo(x, y, x, y + w - m, r)
            this.ctx.fillStyle = c
            this.ctx.fill()
            this.ctx.restore()
        },

        setMines(){
            this.mines_loc = this.g_arr.sort(() => Math.random() - 0.5).slice(0, this.mines) 
            this.mines_loc.forEach(n => {
                this.g_obj[n].mark = -1;
                let around = this.getAround(n);
                console.log(around)
                around.forEach(xy => {
                    if(this.g_obj[xy].mark != -1)
                        this.g_obj[xy].mark += 1
                })
            })

            console.log(this.mine_loc)
            console.log(this.g_obj)

        },

        getAround(xy){
            let [x, y] = xy.split("-").map(n => n * 1)
            let around = []
            for(let i = -1; i <= 1; i ++ ){
                for(let j = -1; j <= 1; j ++ ){
                    let id = `${x + i}-${y + j}`
                    if (this.g_arr.includes(id) && id != xy ){
                        around.push(id)
                    }
                }
            }
            return around

        },
        showInfo(){
            this.g_arr.forEach(n => {
                if(this.g_obj[n].mark == -1){
                    this.drawBlock(n, this.g_color.mine)
                }
                else{
                    this.showEachInfo(n, this.g_obj[n].mark)
                }
            })
        },

        showEachInfo(xy, txt){
            let [x, y] = xy.split("-").map(n => n * 50)
            this.ctx.save()
            this.ctx.font = 'bold 20px Arial'
            this.ctx.fillStyle = this.f_color[ this.g_obj[xy].mark ]
            // console.log(this.f_color[ this.g_obj[xy].mark ])
            this.ctx.textAlign = "center"
            this.ctx.textBaseline = 'middle'
            this.ctx.fillText(txt, x + 25, y + 25)
            this.ctx.restore()
        },

        openZero(xy){
            let around = this.getAround(xy)
            around.forEach(n => {
                if(this.g_obj[n].open == 0){
                    this.g_obj[n].open = 1
                    this.drawBlock(n, this.g_color.open )
                    this.showEachInfo(n, this.g_obj[n].mark)
                    if( this.g_obj[n].mark == 0){
                        this.openZero(n)
                    }
                }
            })
        }
        

    },
}).mount("#myApp")

