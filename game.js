/* global $ */

var Start = function (col, row, n) {
    this.header = $("#header")
    this.headertext = new Array()
    this.col = col
    this.row = row
    this.num_cell = col * row
    this.n = n
    this.z = 0
    this.isMoving = false
    this.init()
    this.score = 0
}
Start.prototype.init = function () {
    this.score = 0
    this.headertext.push("Score ")
    this.headertext.push(String(this.score))
    this.header.html(this.headertext.join(" "))
    var that = this
    this.array().forEach(function(a, i) {
        var y = Math.ceil((i + 1) / that.col)
        var x = Math.floor((i + 1) % that.col) || that.col
        var cell = that.cell(a)
        cell.attr("id", "x" + x + "y" + y)
        $("#map").append(cell)
        if (x == that.col) {
            $("#map").append($("<br>").attr("id", "r" + y))
        }
    })
    while (true) {
        var l = this.checkcell()
        var arr = l[0]
        if (l[1]) {
            for (var i = 0; i < this.col; i++) {
                for (var j = 0; j < this.row; j++) {
                    if (arr[i][j]) {
                        this.getcell(i, j).removeClass(String(this.getcolor(i, j)))
                            .addClass("c" + Math.floor(Math.random() * this.n))
                    }
                }
            }
        } else {
            break
        }
    }
    this.setclickevents()
}

Start.prototype.cell = function (e) {
    var cell = $("<div></div>")
        .addClass("cell")
        .addClass("z-depth-1")
        .addClass("c" + e)
        .css({"z-index":"" + this.z})
    this.z++
    return cell
}

Start.prototype.array = function () {
    var arr = []
    for (var i = 0; i < this.num_cell; i++) {
        arr.push(Math.floor(Math.random() * this.n))
    }
    return arr;
}

Start.prototype.setsingleclick = function (component) {
    var int = 10
    var start = this
    component.mousedown(function (e) {
        if (start.isMoving) {
            return
        }
        $(this).css({"z-index":"" + start.z})
        start.z++
        var i
        var step, step2
        var vMove = [10, 10, 8, 6, 4, 3, 2, -2, -3]
        var vEdge = [10, 6, 2, -10, -7, -3, -3, 3, 2]
        var isMove = true
        var that = this
        var px = e.pageX, py = e.pageY
        var t
        var x = parseInt($(this).attr("id").match(/\d+(?=y)/g))
        var y = parseInt($(this).attr("id").match(/\d+$/g))
        $(document).mousemove(function (e) {
            if (isMove) {
                if (e.pageX - px > 30) {
                    step = new Count(0)
                    if (x + 1 <= start.col) {
                        step2 = new Count(0)
                        t = $("#x" + (x + 1) + "y" + y)
                        i = self.setInterval(function () {
                            left(t, "move", step2)
                            right(that, "move", step)
                        }, int)
                        $(that).attr("id", "x" + (x + 1) + "y" + y)
                        t.attr("id", "x" + x + "y" + y)
                        self.setTimeout(function () {
                            var ch = start.check(1)
                            if (!ch) {
                                step = new Count(0)
                                step2 = new Count(0)
                                i = self.setInterval(function () {
                                    left(that, "move", step)
                                    right(t, "move", step2)
                                }, int)
                                t.attr("id", "x" + (x + 1) + "y" + y)
                                $(that).attr("id", "x" + x + "y" + y) 
                            }
                        }, int * vMove.length)
                    } else {
                        i = self.setInterval(function () {
                            right(that, "edge", step)
                        }, int)
                    }
                } else if (e.pageX - px < -30) {
                    step = new Count(0)
                    if (x - 1 > 0) {
                        step2 = new Count(0)
                        t = $("#x" + (x - 1) + "y" + y)
                        i = self.setInterval(function () {
                            left(that, "move", step)
                            right(t, "move", step2)
                        }, int)
                        $(that).attr("id", "x" + (x - 1) + "y" + y)
                        t.attr("id", "x" + x + "y" + y)
                        self.setTimeout(function () {
                            var ch = start.check(1)
                            if (!ch) {
                                step = new Count(0)
                                step2 = new Count(0)
                                i = self.setInterval(function () {
                                    left(t, "move", step)
                                    right(that, "move", step2)
                                }, int)
                                t.attr("id", "x" + (x - 1) + "y" + y)
                                $(that).attr("id", "x" + x + "y" + y) 
                            }
                        }, int * vMove.length)
                    } else {
                        i = self.setInterval(function () {
                            left(that, "edge", step)
                        }, int)
                    }
                } else if (e.pageY - py > 30) { 
                    step = new Count(0)
                    if (y + 1 <= start.row) {
                        step2 = new Count(0)
                        t = $("#x" + x + "y" + (y + 1))
                        i = self.setInterval(function () {
                            up(t, "move", step2)
                            down(that, "move", step)
                        }, int)
                        $(that).attr("id", "x" + x + "y" + (y + 1))
                        t.attr("id", "x" + x + "y" + y)
                        self.setTimeout(function () {
                            var ch = start.check(1)
                            if (!ch) {
                                step = new Count(0)
                                step2 = new Count(0)
                                i = self.setInterval(function () {
                                    up(that, "move", step)
                                    down(t, "move", step2)
                                }, int)
                                t.attr("id", "x" + x + "y" + (y + 1))
                                $(that).attr("id", "x" + x + "y" + y) 
                            }
                        }, int * vMove.length)
                    } else {
                        i = self.setInterval(function () {
                            down(that, "edge", step)
                        }, int)
                    }
                } else if (e.pageY - py < -30) {
                    step = new Count(0)
                    if (y - 1 > 0) {
                        step2 = new Count(0)
                        t = $("#x" + x + "y" + (y - 1))
                        i = self.setInterval(function () {
                            up(that, "move", step)
                            down(t, "move", step2)
                        }, int)
                        $(that).attr("id", "x" + x + "y" + (y - 1))
                        t.attr("id", "x" + x + "y" + y)
                        self.setTimeout(function () {
                            var ch = start.check(1)
                            if (!ch) {
                                step = new Count(0)
                                step2 = new Count(0)
                                i = self.setInterval(function () {
                                    up(t, "move", step)
                                    down(that, "move", step2)
                                }, int)
                                t.attr("id", "x" + x + "y" + (y - 1))
                                $(that).attr("id", "x" + x + "y" + y) 
                            }
                        }, int * vMove.length)
                    } else {
                        i = self.setInterval(function () {
                            up(that, "edge", step)
                        }, int)
                    }
                } else {
                    return
                }
                isMove = false
            }
        }).mouseup(function () {
            isMove = false
        })
        function right(that, ty, step) {
            var v
            if (ty == "move") {
                v = vMove
            } else if (ty == "edge") {
                v = vEdge
            }
            $(that).css({"right":"-=" + v[step.n] + "px"})
            step.n++
            if (step.n == v.length) {
                self.clearInterval(i)
                if (ty == "edge") {
                    return
                }
                var x = parseInt($(that).attr("id").match(/\d+(?=y)/g))
                var y = parseInt($(that).attr("id").match(/\d+$/g))
                var next
                if (x == start.col) {
                    next = $("#r" + y)
                } else {
                    next = start.getcell(x, y - 1)
                }
                var t = $(that)
                t.remove()
                t.css({"right":"0px"})
                start.setsingleclick(t)
                next.before(t)
            }
        }
        function left(that, ty, step) {
            var v
            if (ty == "move") {
                v = vMove
            } else if (ty == "edge") {
                v = vEdge
            }
            $(that).css({"right":"+=" + v[step.n] + "px"})
            step.n++
            if (step.n == v.length) {
                self.clearInterval(i)
                if (ty == "edge") {
                    return
                }
                $(that).css({"right":"0px"})
            }
        }   
        function down(that, ty, step) {
            var v
            if (ty == "move") {
                v = vMove
            } else if (ty == "edge") {
                v = vEdge
            }
            $(that).css({"bottom":"-=" + v[step.n] + "px"})
            step.n++
            if (step.n == v.length) {
                self.clearInterval(i)
                if (ty == "edge") {
                    return
                }
                var x = parseInt($(that).attr("id").match(/\d+(?=y)/g))
                var y = parseInt($(that).attr("id").match(/\d+$/g))
                var next
                if (x == start.col) {
                    next = $("#r" + y)
                } else {
                    next = start.getcell(x, y - 1)
                }
                var t = $(that)
                t.remove()
                t.css({"bottom":"0px"})
                start.setsingleclick(t)
                next.before(t)
            }
        }
        function up(that, ty, step) {
            var v
            if (ty == "move") {
                v = vMove
            } else if (ty == "edge") {
                v = vEdge
            }
            $(that).css({"bottom":"+=" + v[step.n] + "px"})
            step.n++
            if (step.n == v.length) {
                self.clearInterval(i)
                if (ty == "edge") {
                    return
                }
                var x = parseInt($(that).attr("id").match(/\d+(?=y)/g))
                var y = parseInt($(that).attr("id").match(/\d+$/g))
                var next
                if (x == start.col) {
                    next = $("#r" + y)
                } else {
                    next = start.getcell(x, y - 1)
                }
                var t = $(that)
                t.remove()
                t.css({"bottom":"0px"})
                start.setsingleclick(t)
                next.before(t)
            }
        }
    })
}

Start.prototype.setclickevents = function () {
    this.setsingleclick($(".cell"))
}

Start.prototype.checkcell = function () {
    var fourcount = 0
    var fivecount = 0
    var arr = []
    var has3 = false
    for (var i = 0; i < this.col; i++) {
        var t = []
        for (var j = 0; j < this.row; j++) {
            t.push(false)
        }
        arr.push(t)
    }
    for (var i = 0; i < this.col; i++) {
        for (var j = 0; j < this.row; j++) {
            var color = String(this.getcolor(i, j))
            if (color == String(this.getcolor(i + 1, j)) && color == String(this.getcolor(i + 2, j))) {
                if (color != String(this.getcolor(i - 1, j))) {
                    if (color == String(this.getcolor(i + 3, j))) {
                        if (color == String(this.getcolor(i + 4, j))) {
                            if (color != String(this.getcolor(i + 5, j))) {
                                fivecount++;
                            }
                        } else {
                            fourcount++;
                        }
                    }
                }
                arr[i][j] = true
                arr[i + 1][j] = true
                arr[i + 2][j] = true
                has3 = true
            }
            if (color == String(this.getcolor(i, j + 1)) && color == String(this.getcolor(i, j + 2))) {
                if (color != String(this.getcolor(i, j - 1))) {
                    if (color == String(this.getcolor(i, j + 3))) {
                        if (color == String(this.getcolor(i, j + 4))) {
                            if (color != String(this.getcolor(i, j + 5))) {
                                fivecount++
                            }
                        } else {
                            fourcount++
                        }
                    }
                }
                arr[i][j] = true
                arr[i][j + 1] = true
                arr[i][j + 2] = true
                has3 = true
            }
        }
    }
    for (var ifmore = true; ifmore; ) {
        ifmore = false
        for (var i = 0; i < this.col; i++) {
            for (var j = 0; j < this.row; j++) {
                if (arr[i][j]) {
                    if (this.getcell(i, j).hasClass("bomb") && !this.getcell(i, j).hasClass("bdetected")) {
                        ifmore = true
                        this.getcell(i, j).addClass("bdetected")
                        if (i > 0) {
                            arr[i - 1][j] = true
                            if (j > 0) {
                                arr[i - 1][j - 1] = true
                            }
                            if (j < this.row - 1) {
                                arr[i - 1][j + 1] = true
                            }
                        }
                        if (i < this.col - 1) {
                            arr[i + 1][j] = true
                            if (j > 0) {
                                arr[i + 1][j - 1] = true
                            }
                            if (j < this.row - 1) {
                                arr[i + 1][j + 1] = true
                            }
                        }
                        if (j > 0) {
                            arr[i][j - 1] = true
                        }
                        if (j < this.row - 1) {
                            arr[i][j + 1] = true
                        }
                    }
                    if (this.getcell(i, j).hasClass("lightening") && !this.getcell(i, j).hasClass("ldetected")) {
                        ifmore = true
                        this.getcell(i, j).addClass("ldetected")
                        $("." + this.getcolor(i, j)).each(function () {
                            var x = parseInt($(this).attr("id").match(/\d+(?=y)/g))
                            var y = parseInt($(this).attr("id").match(/\d+$/g))
                            arr[x - 1][y - 1] = true
                        })
                    }
                }
            }
        }
    }
    $(".bdetected").each(function () {
        $(this).removeClass("bdetected")
    })
    $(".ldetected").each(function () {
        $(this).removeClass("ldetected")
    })
    return [arr, has3, fourcount, fivecount]
}

Start.prototype.check = function (layer) {
    this.isMoving = true
    var l = this.checkcell()
    var arr = l[0]
    var has3 = l[1]
    var fourcount = l[2]
    var fivecount = l[3]
    var that = this
    if (!has3) {
        this.isMoving = false
        return false
    }
    var count = new Array()
    var list
    var n = 0
    for (var i = 0; i < this.col; i++) {
        list = []
        for (var j = 0; j < this.row; j++) {
            if (arr[i][j]) {
                list.push((j + 1))
                n++
            }
        }
        if (list.length != 0) {
            count[i] = this.update(i + 1, list, "zoomOut")
        } else {
            count[i] = []
        }
    }
    this.score += layer * n
    this.headertext.pop()
    this.headertext.push(String(this.score))
    this.header.html(this.headertext.join(" "))
    self.setTimeout(function () {
        for (var i = 0; i < that.col; i++) {
            that.supply(i + 1, count[i])
        }
        that.fallall("free")
        self.setTimeout(function () {
            var cell
            var x, y
            for (var i = 0; i < fivecount; i++) {
                x = Math.floor(Math.random() * that.col)
                y = Math.floor(Math.random() * that.row)
                cell = that.getcell(x, y)
                if (!cell.hasClass("bomb") && !cell.hasClass("lightening")) {
                    cell.addClass("lightening")
                } else {
                    i--
                }
            }
            for (var i = 0; i < fourcount; i++) {
                x = Math.floor(Math.random() * that.col)
                y = Math.floor(Math.random() * that.row)
                cell = that.getcell(x, y)
                if (!cell.hasClass("bomb") && !cell.hasClass("lightening")) {
                    cell.addClass("bomb")
                } else {
                    i--
                }
            }
            that.check(layer + 1)
            this.isMoving = false
        }, 400)
    }, 300)
    return true
}

Start.prototype.update = function (col, list, style) {
    style = style || "zoomOut"
    var count = new Array()
    var len = list.length
    var max = Math.max.apply(null, list)

    if (style = "zoomOut") {
        var k = 0
        for (var i = 0 ; i < max; i++) {
            if (k < len && i == list[k] - 1) {
                count[i] = -1
                
                var w = 34, h = 34      // parameters
                
                var x = col - 1, y = list[k] - 1
                var l = 20 + 38 * x, t = 20 + 38 * y
                if (this.getcell(x, y).hasClass("bomb")) {
                    this.getcell(x, y).removeClass("bomb")
                    this.mask(x, y, parseInt(this.getcolor(x, y).toString().match(/\d+$/g)))
                        .animate({"height":64 + "px", "width":64 + "px", "left": (l - 17) + "px", "top":(t - 17) + "px", "opacity":"0.5", "border-radius":"32px"}, 100, "linear")
                        .animate({"height":118 + "px", "width":118 + "px", "left": (l - 44) + "px", "top":(t - 44) + "px", "opacity":"0", "border-radius":"59px"}, 200, "swing", function () {$(this).remove()})
                } else if (this.getcell(x, y).hasClass("lightening")){
                    this.getcell(x, y).removeClass("lightening")
                    // replaced with other animations 
                    this.mask(x, y, parseInt(this.getcolor(x, y).toString().match(/\d+$/g)))
                        .animate({"height":h + "px", "width":w + "px", "left":(l - (w - 30) / 2) + "px", "top":(t - (h - 30) / 2) + "px", "opacity":"0.5", "border-radius":"6px"}, 150, "swing")
                        .animate({"height":"30px", "width":"30px", "left":l + "px", "top":t + "px", "opacity":"0"}, 150, "swing", function () {$(this).remove()})
                } else {
                    this.mask(x, y, parseInt(this.getcolor(x, y).toString().match(/\d+$/g)))
                        .animate({"height":h + "px", "width":w + "px", "left":(l - (w - 30) / 2) + "px", "top":(t - (h - 30) / 2) + "px", "opacity":"0.5", "border-radius":"6px"}, 150, "swing")
                        .animate({"height":"30px", "width":"30px", "left":l + "px", "top":t + "px", "opacity":"0"}, 150, "swing", function () {$(this).remove()})
                }
                this.hide(col - 1, i)
                k++
            } else {
                count[i] = 0
                var mask = this.mask(col - 1, i, parseInt(this.getcolor(col - 1, i).toString().match(/\d+$/g))) 
                if (this.getcell(col - 1, i).hasClass("bomb")) {
                    mask.addClass("bomb")
                    this.getcell(col - 1, i).removeClass("bomb")
                } else if (this.getcell(col - 1, i).hasClass("lightening")) {
                    mask.addClass("lightening")
                    this.getcell(col - 1, i).removeClass("lightening")
                }
                this.hide(col - 1, i)
            }
        }
        var drop = 0
        for (var i = count.length - 1; i >= 0; i--) {
            if (count[i] == -1) {
                drop++
            } else {
                count[i] = drop
            }
        }
    }
    return count
}

Start.prototype.supply = function (col, list) {
    var max = 0
    for (var i = 0; i < list.length; i++) {
        if (list[i] == -1) max++
    }
    var y = 0
    for (var i = 0; i < list.length; i++) {
        if (list[i] == -1) {
            this.mask(col - 1, -y - 1).attr("value", max)
            y++
        } else {
            $("#mx" + col + "y" + (i + 1)).attr("value", list[i])
        }
    }
}

Start.prototype.fallall = function (style) {
    style = style || "free"
    if (style == "free") {
        // add custom v-function
        var all = $(".mask")
        var len = all.length
        for (var i = 0; i < len; i++) {
            var v = parseInt($(all[i]).attr("value"))
            if (v == -1) {
                $(all[i]).remove()
            } else {
                var id = $(all[i]).attr("id")
                var x = parseInt(id.match(/\d+(?=y)/g))
                var y = parseInt(id.match(/-?\d+$/g))
                $(all[i]).attr("id", "mx" + x + "y" + (y + v)).animate({"top":"+=" + (38 * v) + "px"}, 300, function () {
                    var id = $(this).attr("id")
                    var x = parseInt(id.match(/\d+(?=y)/g))
                    var y = parseInt(id.match(/-?\d+$/g))
                    var color = $(this).attr("class").match(/c\d+(?=( bomb)?( lightening)? mask)/g)
                    var oc =  $("#x" + x + "y" + y).attr("class").match(/c\d+(?=( bomb)?( lightening)? z-depth-0)/g)
                    $("#x" + x + "y" + y).removeClass("z-depth-0")
                        .removeClass(oc.toString())
                        .addClass("z-depth-1")
                        .addClass(color.toString())
                        .css("opacity", "1")
                    if ($(this).hasClass("bomb")) {
                        $("#x" + x + "y" + y).addClass("bomb")
                    } else if ($(this).hasClass("lightening")) {
                        $("#x" + x + "y" + y).addClass("lightening")
                    }
                    $(this).removeAttr("value")
                        .remove()
                })
            }
        }
    }
}

Start.prototype.hide = function (x, y) {
    this.getcell(x, y).removeClass("z-depth-1").addClass("z-depth-0").css({"opacity":"0"})
}

Start.prototype.mask = function (x, y, color) {
    if (color == null) {
        color = Math.floor(Math.random() * this.n)
    }
    var m = this.cell(color).addClass("mask").attr("id", "mx" + (x + 1) + "y" + (y + 1))
    m.css({"position":"absolute"})
    m.css({"left":(20 + 38 * x) + "px", "top":(20 + 38 * y) + "px"})
    $("#map").append(m)
    return m
}

Start.prototype.getcell = function (x, y) {
    return $("#x" + (x + 1) + "y" + (y + 1))
}
Start.prototype.getcolor = function (x, y) {
    if (x >= 0 && x < this.col && y >= 0 && y < this.row) {
        return this.getcell(x, y).attr("class").match(/c\d+((?= )|$)/g)
    } else {
        return ""
    }
}

var Count = function (n) {
    this.n = n
}
