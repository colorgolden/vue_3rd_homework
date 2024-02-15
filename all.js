// Initialization for ES Users

import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

const url = 'https://vue3-course-api.hexschool.io'; // 請加入站點
const path = 'colorgolden'; // 請加入個人 API Path

let productModal = null;
let delProductModal = null;


const app = {
  data() {
    return { 
      temp:{},
      products:[],
      addNew: false,
      newProduct :{
        // title: '',
        // category: '',
        // origin_price: 0,
        // price: 300,
        // unit: "個",
        // description: "Sit down please 名設計師設計",
        // content: "這是內容",
         is_enabled: 1,
         imageUrl: "",
         imagesUrl: [
         "",
         ],
        },
     }
  },

  mounted() {
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });
  },

  methods: {

    login() {
      const username = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;
      const users = {
        username,
        password
      }
      
      
      // #2 發送 API 至遠端並登入（並儲存 Token）
      axios.post(`${url}/v2/admin/signin`, users)
        .then((res) => {
          window.location.href = 'admin_products.html'; //跳轉到products頁面
          const { token, expired } = res.data;
          document.cookie = `newToken=${token}; expires=${new Date(expired)};`;
        })
        .catch((error) => {
          alert(error.data.message);
        })
    },

    checkLogin() {
      // #3 取得 Token（Token 僅需要設定一次）
      
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)newToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common['Authorization'] = token;

      if (!window.location.href.includes('index.html')) {  //只要不是在index頁面，就執行大括號內的程式碼
        // #4  確認是否登入
        axios.post(`${url}/v2/api/user/check`, {}, { headers: { 'Authorization': token } })
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            alert("尚未登入會員，請重新登入！");
            window.location.href = 'index.html'; //跳轉到login頁面
            alert(error.data.message);
            return;
          })
      } else {
        return;
      }
    },

    getProducts() {
      // #5 取得後台產品列表
      
      axios.get(`${url}/v2/api/${path}/admin/products`)
        .then((res) => {
          // 將res.data.products設定到Vue的products陣列中
          this.products = res.data.products;
        })
        .catch((error) => {
          alert('取得產品資料失敗', error.data.message);
        })
    },

    showModal(addNew, product) {
    
      if (addNew === "addNew") {
        this.newProduct = {
          imagesUrl: [],
        };
        this.addNew = true;
        productModal.show();
      } else if (addNew === "edit") {
        this.addNew = false;
        // 將所選產品的值複製給 newProduct
        this.newProduct = { ...product };
        productModal.show();
      } else if (addNew === "delete") {
        this.addNew = false;
        this.newProduct = { ...product };
        delProductModal.show();
      }
    },



    delProduct(){
      axios.delete(`${url}/api/${path}/admin/product/${this.newProduct.id}`)
      .then((res) => {
        alert('刪除產品成功');
        this.getProducts(); //重新取得產品資料
        delProductModal.hide();
      })
      .catch((error) => {
        alert('沒有正確刪除產品',error.data.message);
      })
    },

    addNewProduct() {
      // #6 新增單一產品資訊
      axios.post(`${url}/v2/api/${path}/admin/product`,{ data: this.newProduct })
        .then((res) => {
          alert('新增產品成功');
          this.getProducts();
          productModal.hide();
        })
        .catch((error) => {
          alert('新增產品失敗',error.data.message);
        })
    },

    updateProduct() {
      // #7 新增單一產品資訊
      axios.put(`${url}/v2/api/${path}/admin/product/${this.newProduct.id}`,{ data: this.newProduct })
        .then((res) => {
          alert('更新產品成功');
          this.getProducts();
          productModal.hide();
        })
        .catch((error) => {
          alert('更新產品資料失敗',error.data.message);
        })
    },

    addImagesUrl(){
      // #8 新增圖片
      this.newProduct.imagesUrl = [];
      this.newProduct.imagesUrl.push('');
    },
  },
  created() {  
    this.checkLogin();
    this.getProducts(); 
  }
}

// Use createApp to create the Vue app
const vueApp = createApp(app);

// Mount the app to the specified element
vueApp.mount('#app');





