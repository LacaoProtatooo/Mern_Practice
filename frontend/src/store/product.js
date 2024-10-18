import { create } from "zustand"

export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }),

    // const [state, setState] = useState([])

    createProduct: async (newProduct) => {
        if(!newProduct.name || !newProduct.image || !newProduct.price) {
            return {success:false, message:"Please fill in all Fields."}
        }
        const res = await fetch("/api/products", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(newProduct)
        })
        const data = await res.json();
        set((state) => ({products:[...state.products, data.data]}));
        // data.<data> is where what parameter is on your controller value parameter <data>

        return {success:true, message:"Product Created Successfully."}
    },

    fetchProducts: async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        set({ products: data.data });
    },

    deleteProduct: async (pid) => {
        const res = await fetch(`/api/products/${pid}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if(!data.success) return {success: false, message: data.message };

        // updates the ui immediately, without refreshing page
        set(state => ({ products: state.products.filter(product => product._id !== pid) }));

        return { success: true, message: data.message };
    },

    updateProduct: async (pid, updatedProduct) => {
        const res = await fetch(`/api/products/${pid}`, {
            method:"PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct)
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        // Updates the state in the UI on updated Product (without needing the refresh)
        set(state => ({
            products: state.products.map((product) => (product._id === pid? data.data : product)),
        }));

        return { success: true, message: data.message };
    },

}))

// const [state, setState] = useState([])