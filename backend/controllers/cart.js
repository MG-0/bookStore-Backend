const Cart = require("../models/Cart");

// Get Items in Cart
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id}).populate("items.book", "title price coverImage stock")
        if (!cart) {
           cart =  new Cart({user: req.user.id, items: []})
            await cart.save()
        }
        return res.status(200).json({ sucess: true, message: "Cart retrieved successfully", cart})
    } catch (error) {
         console.error("Error retrieving cart:", error);
       return res.status(500).json({
      success: false,
      message: "Error retrieving cart",
      error: error.message,
    });
    }
}

const Book = require("../models/Book");

// Add Items to Cart
exports.addToCart = async (req, res) => {
    try { 
        const { bookId} = req.body;
        let cart = await Cart.findOne({ user: req.user.id}).populate("items.book", "title price coverImage stock")
        if (!cart) {
           cart =  new Cart({user: req.user.id, items: []})
        }
        
        const book = await Book.findById(bookId)
        if (!book) return res.status(404).json({ message: "Book not found" });
        if (book.stock <= 0) return res.status(400).json({ message: "Out of stock" });

        const itemIndex = cart.items.findIndex(item => (item.book._id ? item.book._id.toString() : item.book.toString()) === bookId)
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += 1
        } else {
            cart.items.push({book: bookId, price: book.price, quantity: 1})
        }
        book.stock -= 1
        await book.save()

        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        
        // Save the cart first so the newly pushed book ObjectId can be populated below
        await cart.save()
        
        const populatedCart = await Cart.findById(cart._id).populate("items.book", "title price coverImage stock")
        return res.status(200).json({ success: true, message: "Item added to cart successfully", cart: populatedCart})
    } catch (error) {
        return res.status(500).json({ message: "Error adding to cart", error: error.message });
    }
}

// Update Cart Items
exports.updateCart = async (req, res) => {
    try {
        const { bookId, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.user.id}).populate("items.book", "title price coverImage stock")
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const item = cart.items.find(item => (item.book._id ? item.book._id.toString() : item.book.toString()) === bookId)
        if (!item) return res.status(404).json({ message: "Item not found in cart" });

        const book = await Book.findById(bookId)
        if (!book) return res.status(404).json({ message: "Book not found" });

        const difference = quantity - item.quantity;
        if (difference > 0) {
           if(book.stock < difference) return res.status(400).json({ message: "Not enough stock" });
           book.stock -= difference;
        } else {
            book.stock += Math.abs(difference);
        }
        item.quantity = quantity;
        await book.save();

        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate("items.book", "title price coverImage stock");
        return res.status(200).json({ success: true, message: "Item Updated in cart successfully", cart: populatedCart})
    } catch (err) {
         res.status(500).json({ message: "Error updating cart", error: err.message });
    }
}

// Delete Item From Cart
exports.deleteCart = async (req, res) => {
    try {
        const { bookId } = req.params;
        let cart = await Cart.findOne({user: req.user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        const itemIndex = cart.items.findIndex(item => (item.book._id ? item.book._id.toString() : item.book.toString()) === bookId)
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        const item = cart.items[itemIndex]
        const book = await Book.findById(bookId);
        if (book) {
            book.stock += item.quantity;
            await book.save()
        }       
        cart.items.splice(itemIndex, 1)

        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        await cart.save()
        const populatedCart = await Cart.findById(cart._id).populate("items.book", "title price coverImage stock")
        return res.status(200).json({ success: true, message: "Item Removed From cart successfully", cart: populatedCart})
    } catch (error) {
    return res.status(500).json({ message: "Error removing item", error: error.message });
    }
}