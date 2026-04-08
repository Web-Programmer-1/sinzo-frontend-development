"use client";
import React from 'react';
import { 
  Package, 
  Wallet, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  CreditCard, 
  ArrowRight,
  TrendingUp,
  History,
  Banknote,
  ShieldCheck,
  XCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useGetCustomarDashboardOverview } from '../../../Apis/dashboard';

const CustomerDashboard = () => {
  const { data: res, isLoading, isError } = useGetCustomarDashboardOverview();

  if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center animate-pulse text-zinc-500">Loading Pro Dashboard...</div>;
  if (isError || !res) return <div className="p-6 text-center text-red-500">Failed to load data.</div>;

  // Data destructuring from res
  const {
    summary,
    graphs,
    charts,
    recentOrders,
    latestManualPaymentStatus,
    recentActivityTimeline
  } = res;

  const COLORS = ['#27272a', '#10B981', '#f43f5e', '#3b82f6'];

  return (
    <div className="min-h-screen bg-zinc-50 pb-12 font-sans">
      {/* Header Section - Modern Black */}
      <div className="bg-zinc-950 p-6 pb-24 rounded-b-[2.5rem] shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">DASHBOARD</h1>
            <p className="text-zinc-400 text-xs mt-1">Real-time overview of your activities</p>
          </div>
          <div className="h-10 w-10 bg-zinc-800 rounded-full border border-zinc-700 flex items-center justify-center">
             <Package size={20} className="text-white" />
          </div>
        </div>
      </div>

      <div className="px-4 -mt-16 space-y-6">
        {/* Main Stats - Mobile 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard title="Total Spent" value={`৳${summary.totalSpent}`} icon={<Wallet size={18}/>} isBlack />
          <StatCard title="Total Due" value={`৳${summary.totalDue}`} icon={<AlertCircle size={18}/>} textColor="text-red-600" />
          <StatCard title="Paid Amount" value={`৳${summary.totalPaid}`} icon={<CheckCircle size={18}/>} textColor="text-green-600" />
          <StatCard title="Total Orders" value={summary.totalOrders} icon={<Package size={18}/>} textColor="text-zinc-900" />
        </div>

        {/* Order Status Chips - Quick Look */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <StatusChip label={`${summary.deliveredOrders} Delivered`} color="bg-green-100 text-green-700" />
          <StatusChip label={`${summary.pendingOrders} Pending`} color="bg-amber-100 text-amber-700" />
          <StatusChip label={`${summary.cancelledOrders} Cancelled`} color="bg-red-100 text-red-700" />
        </div>

        {/* Verification Alert (Missing Data Added) */}
        {latestManualPaymentStatus && (
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold bg-zinc-900 text-white px-2 py-1 rounded-md uppercase tracking-widest">
                Payment Verification
              </span>
              <ShieldCheck size={16} className="text-green-500" />
            </div>
            <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-zinc-500">Gateway:</span>
                 <span className="font-bold text-zinc-900">{latestManualPaymentStatus.gateway}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-zinc-500">TrxID:</span>
                 <span className="font-mono font-medium">{latestManualPaymentStatus.transactionId}</span>
               </div>
               <div className="p-3 bg-zinc-50 rounded-xl mt-2 border border-dashed border-zinc-200">
                 <p className="text-[10px] text-zinc-400 uppercase font-bold">Admin Note</p>
                 <p className="text-xs text-zinc-700 italic">"{latestManualPaymentStatus.adminNote}"</p>
               </div>
            </div>
          </div>
        )}

        {/* Spending Graph - Black Theme */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-zinc-900 flex items-center gap-2">
              <TrendingUp size={18}/> Monthly Spending
            </h3>
            <span className="text-xs font-bold text-zinc-400">2026</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphs.monthlySpending}>
                <defs>
                  <linearGradient id="colorBlack" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="step" dataKey="value" stroke="#18181b" strokeWidth={3} fillOpacity={1} fill="url(#colorBlack)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods - (New Addition) */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-100">
          <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <Banknote size={18}/> Payment Methods
          </h3>
          <div className="space-y-3">
            {charts.paymentMethod.map((m: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-600">{m.method.replace(/_/g, ' ')}</span>
                <div className="flex items-center gap-3 flex-1 px-4">
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-zinc-900" 
                      style={{ width: `${(m.count / summary.totalOrders) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-zinc-900">{m.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders - List */}
        <div>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="font-bold text-zinc-900">Recent Orders</h3>
            <button className="h-8 w-8 bg-zinc-900 text-white rounded-full flex items-center justify-center">
              <ArrowRight size={16}/>
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="bg-white p-4 rounded-3xl shadow-sm border border-zinc-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${order.orderStatus === 'DELIVERED' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                    <Package size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-zinc-900">{order.orderNumber}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-zinc-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${order.paymentStatus === 'PAID' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-zinc-900">৳{order.totalAmount}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{order.orderStatus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
            <h3 className="font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <History size={18}/> Activity Timeline
            </h3>
            <div className="space-y-8">
                {recentActivityTimeline.slice(0, 5).map((item: any, idx: number) => (
                    <div key={item.id} className="relative flex gap-4">
                        {idx !== 4 && (
                            <span className="absolute left-[9px] top-6 w-[1.5px] h-[calc(100%+1.5rem)] bg-zinc-100"></span>
                        )}
                        <div className={`mt-1 h-5 w-5 rounded-full z-10 flex items-center justify-center ${item.status === 'DELIVERED' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-zinc-900'}`}>
                            {item.status === 'DELIVERED' ? <CheckCircle size={10} className="text-white"/> : <Clock size={10} className="text-white" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <p className="text-xs font-bold text-zinc-900 uppercase tracking-tight">{item.status}</p>
                                <p className="text-[9px] text-zinc-400">{new Date(item.createdAt).getHours()}:{new Date(item.createdAt).getMinutes()} PM</p>
                            </div>
                            <p className="text-[11px] text-zinc-500 mt-0.5">{item.note}</p>
                            <p className="text-[9px] font-bold text-zinc-300 mt-1">Order: {item.orderNumber}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

// UI Sub-components
const StatCard = ({ title, value, icon, isBlack, textColor = "text-zinc-900" }: any) => (
  <div className={`${isBlack ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'} p-5 rounded-3xl shadow-sm flex flex-col gap-3 border border-zinc-100`}>
    <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${isBlack ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
      {icon}
    </div>
    <div>
      <p className={`text-[10px] font-bold uppercase tracking-widest opacity-60`}>{title}</p>
      <p className={`text-lg font-black leading-none mt-1 ${isBlack ? 'text-white' : textColor}`}>{value}</p>
    </div>
  </div>
);

const StatusChip = ({ label, color }: any) => (
  <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase whitespace-nowrap tracking-wide ${color}`}>
    {label}
  </span>
);

export default CustomerDashboard;