'use strict';
class Item{
    constructor(name, quantity, priority, store, category, price) {
        this.name = name
        this.quantity = quantity
        this.priority = priority
        this.store = store
        this.category = category
        this.price = price
        this._purchased = false
    }
}
class Subject{
    constructor() {
        this.handlers = []
    }
    subscribe(fn) {
            this.handlers.push(fn)
        }
    publish(msg, someobj) {
        var must = someobj || window;
        for (let fn of this.handlers) {
            fn(must, msg)
        }
    }
}
class shoppingList extends Subject{
    constructor() {
        super()
        this.newItems = []
        this.oldItems = []
    }
    addItem(it) {
        this.newItems.push(it)
        this.publish('newitem', this)
    }
}
class ShoppingView {
    constructor(model) {
        model.subscribe(this.redrawList.bind(this))
    }
    redrawList(shoppingList, msg) {
        let tbl = document.getElementById("shoppinglist")
        tbl.innerHTML = ""
        for (let item of shoppingList.newItems) {
            this.addRow(item, tbl)
        }
    }
    addRow(item, parent) {
        let row = document.createElement("tr")
        row.classList.add(item.priority)
        let cb = document.createElement("input")
        cb.type = "checkbox"
        cb.classList.add("form-control")
        row.appendChild(cb)
        for (let val of ['name', 'quantity', 'store', 'category', 'price']) {
            let td = document.createElement("td")
            td.innerHTML = item[val]
            row.appendChild(td)
        }
        parent.appendChild(row)
    }
}
var shoppingModel = new shoppingList()
var myView = new ShoppingView(shoppingModel)

function clickedon() {
    let rowcolids = ['itemname', 'qty', 'store', 'category', 'price', 'priority']
    let vals = {}
    for (let cid of rowcolids) {
        vals[cid] = document.getElementById(cid).value;
    }
    let it = new Item(vals.itemname, vals.qty, vals.priority, vals.store, vals.category, vals.price)
    shoppingModel.addItem(it)
}
window.onload = function (){
    let pageCount = localStorage.getItem('pageCount');
    if(!pageCount){
        pageCount = 0;
    }
    pageCount = +pageCount + 1;
    localStorage.setItem("pageCount", pageCount);
    document.getElementById('page-count').innerHTML = pageCount;
}