'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { Order, OrderStatus } from '@/types';
import { ShoppingBag, Eye, X, PhoneCall, MapPin, CheckCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useShop();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((ord) => {
    if (selectedStatus !== 'all' && ord.status !== selectedStatus) return false;
    return true;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder({ ...activeOrder, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-sky-400" />
            <span>Order Management</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            View customer delivery requests & update dispatch status
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs font-bold text-slate-300">
          <span>Filter Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-transparent focus:outline-none text-white font-bold cursor-pointer"
          >
            <option value="all">All Orders ({orders.length})</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-900/50">
                  <td className="p-4 font-black text-sky-400">{ord.orderNumber}</td>
                  <td className="p-4 font-bold text-white">{ord.customer.fullName}</td>
                  <td className="p-4">{ord.customer.phoneNumber}</td>
                  <td className="p-4 text-slate-400">{ord.items.length} item(s)</td>
                  <td className="p-4 font-black text-white">৳{ord.totalAmount.toLocaleString()}</td>
                  <td className="p-4 font-semibold text-slate-400">{ord.paymentMethod}</td>
                  <td className="p-4">
                    <select
                      value={ord.status}
                      onChange={(e) =>
                        handleStatusChange(ord.id, e.target.value as OrderStatus)
                      }
                      className="bg-slate-900 border border-slate-700 text-amber-400 font-bold text-[11px] px-2.5 py-1 rounded-lg focus:outline-none cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setActiveOrder(ord)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-400 font-bold flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">Order Invoice</span>
                <h3 className="text-lg font-black text-sky-400">{activeOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Customer Box */}
            <div className="p-4 rounded-2xl bg-slate-900 space-y-2 text-xs">
              <h4 className="font-extrabold text-white uppercase tracking-wider border-l-2 border-sky-500 pl-2">
                Customer Information
              </h4>
              <p className="font-bold text-white text-sm">{activeOrder.customer.fullName}</p>
              <p className="flex items-center gap-2 text-slate-300">
                <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                <span>Primary: {activeOrder.customer.phoneNumber}</span>
                {activeOrder.customer.alternativePhone && (
                  <span>| Alt: {activeOrder.customer.alternativePhone}</span>
                )}
              </p>
              <p className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>{activeOrder.customer.deliveryAddress} ({activeOrder.customer.districtArea})</span>
              </p>
            </div>

            {/* Items Box */}
            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold text-white uppercase tracking-wider">Ordered Items</h4>
              <div className="space-y-2">
                {activeOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={it.product.images[0]}
                        alt={it.product.title}
                        className="w-10 h-12 object-cover rounded-md"
                      />
                      <div>
                        <h5 className="font-bold text-white line-clamp-1">{it.product.title}</h5>
                        <p className="text-[10px] text-slate-400">
                          Size: {it.selectedSize} | Color: {it.selectedColor.name} | Qty: {it.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-white">
                      ৳{(it.product.price * it.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-sm font-black text-white">
              <span>Total Payable Amount</span>
              <span className="text-xl text-sky-400">৳{activeOrder.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
