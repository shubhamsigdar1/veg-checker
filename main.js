// API-> https://world.openfoodfacts.org/api/v0/product/[barcode].json
// https://world.openfoodfacts.org/data
function getFetch(){
    let inputVal = document.getElementById("barcode").value;
    if (inputVal.length !== 12) {
        alert(`Please ensure that barcode length is 12 characters.`)
        return; //quicky exist from function without going further
    }

    const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`
    
    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            console.log(data)
            //check product exist or not so we use status property
        if (data.status === 1) {
            const item = new ProductInfo(data.product)
            item.showInfo()
            item.listIngredients()
            item.clearAll()
        } else if (data.status === 0) {
            alert(`Product ${inputVal} not found. Please try another.`)
        }
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}
// Build object without manually - use constructor
class ProductInfo {
    //pass data.product into constructor
    constructor(productData) {
    
        this.brand = productData.brands
        //product name
        this.name = productData.product_name
        //product ingredient
        this.ingredients = productData.ingredients
        //image of product
        this.image = productData.image_url
    }
    //already build object now we build some method
    showInfo() {
        // Initialize Image and name of the product
        console.log(this.ingredients)
        //I want to assign image tag to particular url
        document.getElementById("product-img").src = this.image;
        //I want to assign my text to particular URL 
        document.getElementById("product-name").innerHTML = `${this.name}`;
    }
    //Add new row to the table(by using loop)
    listIngredients() {
        let tableRef = document.getElementById('ingredient-table');
        //why we don't use increment because after deleting 1 row then after that row index:1 move to next row
        // console.log(tableRef.rows)
        for(var i = 1;i<tableRef.rows.length;) {
            
            //we don't want to use refresh page then to do table clean, 
            // we want that user can clear table
            tableRef.deleteRow(i);
        }
        //if ingredients is null
        if (!(this.ingredients == null)) {
            for(var key in this.ingredients) {
                //add a row to end
                let newRow = tableRef.insertRow(-1);
                //create ingrident cell
                let newICell = newRow.insertCell(0);
                // console.log()
                //create vegeterian cell
                let newVCell = newRow.insertCell(1);
                //create text node whatever the text of current ingredient
                let newIText = document.createTextNode(this.ingredients[key].text);
                //we create veg status as seperate variable because to check vegStatus undefined or not
                let vegStatus = this.ingredients[key].vegetarian == null ? 'unknown' : this.ingredients[key].vegetarian
                let newVText = document.createTextNode(vegStatus);
                //put the ingridient text into ingrident cell
                newICell.appendChild(newIText);
                //put the vegeterian text into ingrident cell
                newVCell.appendChild(newVText);
                if (vegStatus === 'no') {
                    newVCell.classList.add('non-veg-item')
                } else if (vegStatus === 'unknown' || vegStatus === 'maybe') {
                    newVCell.classList.add('unknown-item')
                }
            }
        } 
    }
}