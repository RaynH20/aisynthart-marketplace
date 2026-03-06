import { X, Trash2, ShoppingBag, CreditCard, CheckCircle, User, Coins, Zap, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useCredits, PLATFORM_FEE_RATE } from '../context/CreditsContext';
import { useState } from 'react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onBuyCredits?: () => void;
}

export function Cart({ isOpen, onClose, onBuyCredits }: CartProps) {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { createOrder } = useOrders();
  const { balance, spendCredits, processSale } = useCredits();
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'credits' | 'card'>('credits');
  const [isProcessing, setIsProcessing] = useState(false);

  // Convert dollar price to credits (100 credits = $1)
  const totalCredits = totalPrice * 100;
  const platformFeeCredits = Math.round(totalCredits * PLATFORM_FEE_RATE);
  const agentEarningsCredits = totalCredits - platformFeeCredits;
  const canUseCredits = balance >= totalCredits;

  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      alert('Please sign in to complete your purchase');
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === 'credits') {
      if (!canUseCredits) {
        alert('Insufficient credits. Please buy more credits or switch to card payment.');
        setIsProcessing(false);
        return;
      }

      // Process each item with platform fee
      for (const item of items) {
        const itemCredits = item.price * 100;
        await processSale(itemCredits, item.artist || 'unknown', item.title);
      }
    }

    const order = createOrder(user.id, items, totalPrice);
    setLastOrderId(order.id);
    setCheckoutComplete(true);
    clearCart();
    setIsProcessing(false);

    setTimeout(() => {
      setCheckoutComplete(false);
      setLastOrderId(null);
    }, 5000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#111] border-l border-white/10 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold">Your Cart</h2>
            <span className="text-sm text-gray-400">({items.length} items)</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {checkoutComplete ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Order Complete!</h3>
              <p className="text-gray-400 mb-2">Thank you for your purchase</p>
              <p className="text-sm text-gray-500">Order ID: {lastOrderId?.slice(0, 8)}...</p>
              <p className="text-xs text-gray-600 mt-4">
                {paymentMethod === 'credits'
                  ? `You spent ${totalCredits.toLocaleString()} credits!`
                  : 'In a real marketplace, you would receive a download link or confirmation email.'}
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Your cart is empty</p>
              <p className="text-sm text-gray-500 mt-1">Add some AI artworks to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-white/5 rounded-xl p-3 border border-white/10"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.artist}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-purple-400 font-semibold">🪙 {(item.price * 100).toLocaleString()} credits</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && !checkoutComplete && (
          <div className="p-4 border-t border-white/10 space-y-4">
            {/* Payment Method Toggle */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod('credits')}
                  className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'credits'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                      : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  Credits
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                      : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Card
                </button>
              </div>
            </div>

            {/* Credit Balance Info (when credits selected) */}
            {paymentMethod === 'credits' && (
              <div className={`p-3 rounded-lg border ${
                canUseCredits
                  ? 'border-green-500/30 bg-green-500/10'
                  : 'border-red-500/30 bg-red-500/10'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className={`w-4 h-4 ${canUseCredits ? 'text-green-400' : 'text-red-400'}`} />
                    <span className="text-sm">Your Balance</span>
                  </div>
                  <span className={`font-mono font-semibold ${canUseCredits ? 'text-green-400' : 'text-red-400'}`}>
                    {balance.toLocaleString()} credits
                  </span>
                </div>
                {!canUseCredits && (
                  <button
                    onClick={onBuyCredits}
                    className="mt-2 w-full text-sm bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 py-2 rounded-lg transition-colors"
                  >
                    Need more credits? Buy now
                  </button>
                )}
              </div>
            )}

            {/* Fee breakdown */}
            {paymentMethod === 'credits' && (
              <div className="bg-white/5 rounded-xl p-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{totalCredits.toLocaleString()} credits</span>
                </div>
                <div className="flex justify-between text-gray-500 text-xs">
                  <span className="flex items-center gap-1">
                    <Info className="w-3 h-3" /> Platform fee ({Math.round(PLATFORM_FEE_RATE * 100)}%)
                  </span>
                  <span>−{platformFeeCredits.toLocaleString()} credits</span>
                </div>
                <div className="flex justify-between text-green-400 text-xs">
                  <span>Agent earnings</span>
                  <span>{agentEarningsCredits.toLocaleString()} credits</span>
                </div>
                <div className="border-t border-white/10 pt-1.5 flex justify-between font-bold">
                  <span>You pay</span>
                  <span className="text-white">{totalCredits.toLocaleString()} credits <span className="text-gray-500 font-normal text-xs">(${totalPrice})</span></span>
                </div>
              </div>
            )}

            {/* Total (card) */}
            {paymentMethod === 'card' && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total</span>
                <span className="text-xl font-bold">🪙 {totalCredits.toLocaleString()} credits</span>
              </div>
            )}

            {!isAuthenticated && (
              <div className="flex items-center gap-2 text-sm text-yellow-400 bg-yellow-500/10 px-3 py-2 rounded-lg">
                <User className="w-4 h-4" />
                <span>Sign in to complete purchase</span>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={!isAuthenticated || isProcessing || (paymentMethod === 'credits' && !canUseCredits)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : paymentMethod === 'credits' ? (
                <>
                  <Zap className="w-5 h-5" />
                  Pay {totalCredits.toLocaleString()} Credits
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Complete Purchase
                </>
              )}
            </button>
            <button
              onClick={clearCart}
              className="w-full text-gray-400 hover:text-white py-2 text-sm transition-colors"
            >
              Clear Cart
            </button>

            <p className="text-xs text-center text-gray-600">
              {paymentMethod === 'credits'
                ? `${totalCredits.toLocaleString()} credits = $${totalPrice} USD value`
                : 'Demo mode - no real payment processed'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
