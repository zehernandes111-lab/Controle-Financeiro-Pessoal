import React, { useState, useEffect, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Wallet, TrendingUp, TrendingDown, CreditCard, Target, PieChart as PieChartIcon, 
  Plus, Search, Filter, Trash2, Edit2, CheckCircle, AlertCircle, ArrowUpRight, 
  ArrowDownRight, Sun, Moon, Download, Calendar, DollarSign, Layers, ShieldAlert,
  ChevronRight, RefreshCw, Layers3, Check, Clock, FileText, ArrowRightLeft, Sparkles
} from 'lucide-react';

// === DADOS INICIAIS DE DEMONSTRAÇÃO ===
const INITIAL_ACCOUNTS = [
  { id: '1', name: 'Conta Corrente Itaú', type: 'banco', balance: 4250.80, icon: 'landmark', color: 'bg-orange-500' },
  { id: '2', name: 'Reserva Nubank', type: 'investimento', balance: 12800.00, icon: 'trending-up', color: 'bg-purple-600' },
  { id: '3', name: 'Carteira Física', type: 'carteira', balance: 340.00, icon: 'wallet', color: 'bg-emerald-600' },
];

const INITIAL_CARDS = [
  { id: 'c1', name: 'Nubank Roxinho', limit: 8000, used: 2340.50, closingDay: 5, dueDay: 12, color: 'from-purple-600 to-indigo-700' },
  { id: 'c2', name: 'XP Visa Infinite', limit: 15000, used: 4120.00, closingDay: 20, dueDay: 27, color: 'from-slate-800 to-slate-900' }
];

const INITIAL_CATEGORIES = [
  { id: 'cat1', name: 'Alimentação', icon: 'utensils', type: 'despesa', budget: 1500, color: '#f59e0b' },
  { id: 'cat2', name: 'Moradia', icon: 'home', type: 'despesa', budget: 2500, color: '#3b82f6' },
  { id: 'cat3', name: 'Transporte', icon: 'car', type: 'despesa', budget: 800, color: '#ec4899' },
  { id: 'cat4', name: 'Lazer & Estilo', icon: 'film', type: 'despesa', budget: 600, color: '#8b5cf6' },
  { id: 'cat5', name: 'Saúde', icon: 'activity', type: 'despesa', budget: 500, color: '#10b981' },
  { id: 'cat6', name: 'Salário & Renda', icon: 'dollar', type: 'receita', budget: 0, color: '#10b981' },
  { id: 'cat7', name: 'Investimentos', icon: 'trending-up', type: 'receita', budget: 0, color: '#06b6d4' },
];

const INITIAL_TRANSACTIONS = [
  { id: 't1', description: 'Salário Empresa XYZ', amount: 8500.00, date: '2026-10-05', type: 'receita', category: 'Salário & Renda', account: '1', status: 'pago' },
  { id: 't2', description: 'Aluguel do Apê', amount: 2100.00, date: '2026-10-10', type: 'despesa', category: 'Moradia', account: '1', status: 'pago' },
  { id: 't3', description: 'Supermercado Mensal', amount: 1120.40, date: '2026-10-12', type: 'despesa', category: 'Alimentação', account: '1', status: 'pago' },
  { id: 't4', description: 'Combustível posto Shell', amount: 280.00, date: '2026-10-15', type: 'despesa', category: 'Transporte', account: '1', status: 'pago' },
  { id: 't5', description: 'Jantar Restaurante', amount: 195.00, date: '2026-10-18', type: 'despesa', category: 'Lazer & Estilo', account: 'c1', status: 'pago' },
  { id: 't6', description: 'Rendimento Dividendos', amount: 450.20, date: '2026-10-20', type: 'receita', category: 'Investimentos', account: '2', status: 'pago' },
  { id: 't7', description: 'Plano de Saúde', amount: 480.00, date: '2026-10-28', type: 'despesa', category: 'Saúde', account: '1', status: 'pendente' },
  { id: 't8', description: 'Farmácia Medicamentos', amount: 115.50, date: '2026-10-29', type: 'despesa', category: 'Saúde', account: 'c1', status: 'pago' },
  { id: 't9', description: 'Assinatura Streaming', amount: 55.90, date: '2026-10-30', type: 'despesa', category: 'Lazer & Estilo', account: 'c2', status: 'pendente' },
];

const INITIAL_GOALS = [
  { id: 'g1', name: 'Reserva de Emergência', targetAmount: 30000, currentAmount: 18500, deadline: '2027-06-30', icon: 'shield' },
  { id: 'g2', name: 'Viagem para Itália', targetAmount: 15000, currentAmount: 6200, deadline: '2027-11-15', icon: 'plane' },
  { id: 'g3', name: 'Novo Computador', targetAmount: 8000, currentAmount: 4500, deadline: '2026-12-20', icon: 'laptop' },
];

export default function App() {
  // === ESTADOS DA APLICAÇÃO ===
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  
  // Persistência com LocalStorage
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('finan_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('finan_cards');
    return saved ? JSON.parse(saved) : INITIAL_CARDS;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('finan_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finan_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('finan_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  // Filtros de Transações
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [filterCategory, setFilterCategory] = useState('todas');
  const [filterStatus, setFilterStatus] = useState('todos');

  // Modais e Formulários
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionForm, setTransactionForm] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'despesa',
    category: 'Alimentação',
    account: '1',
    status: 'pago',
    recurrence: 'unica'
  });

  // Salvar no LocalStorage sempre que alterar
  useEffect(() => {
    localStorage.setItem('finan_accounts', JSON.stringify(accounts));
    localStorage.setItem('finan_cards', JSON.stringify(cards));
    localStorage.setItem('finan_categories', JSON.stringify(categories));
    localStorage.setItem('finan_transactions', JSON.stringify(transactions));
    localStorage.setItem('finan_goals', JSON.stringify(goals));
  }, [accounts, cards, categories, transactions, goals]);

  // Toast / Notificações simples
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // === CÁLCULOS FINANCEIROS ===
  const metrics = useMemo(() => {
    const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter(t => t.type === 'receita')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = monthlyTransactions
      .filter(t => t.type === 'despesa')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netBalance = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    const pendingExpenses = transactions
      .filter(t => t.type === 'despesa' && t.status === 'pendente')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalBalance,
      income,
      expenses,
      netBalance,
      savingsRate: savingsRate > 0 ? savingsRate.toFixed(1) : 0,
      pendingExpenses
    };
  }, [accounts, transactions]);

  // Categorias de Despesas para Gráfico
  const categoryChartData = useMemo(() => {
    const expensesByCategory = {};
    transactions
      .filter(t => t.type === 'despesa')
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + Number(t.amount);
      });

    return Object.keys(expensesByCategory).map(catName => {
      const catObj = categories.find(c => c.name === catName);
      return {
        name: catName,
        value: expensesByCategory[catName],
        color: catObj ? catObj.color : '#94a3b8'
      };
    });
  }, [transactions, categories]);

  // Evolução Mensal (Comparativo)
  const monthlyComparisonData = useMemo(() => {
    const months = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];
    return months.map((month, idx) => {
      // Gerando dados simulados + reais para o último mês
      if (idx === 5) {
        return {
          month,
          Receitas: metrics.income,
          Despesas: metrics.expenses
        };
      }
      return {
        month,
        Receitas: 7500 + (idx * 200),
        Despesas: 4200 + (idx * 150)
      };
    });
  }, [metrics]);

  // Alertas Automáticos
  const alerts = useMemo(() => {
    const list = [];
    
    // Alerta de cartão próximo do limite
    cards.forEach(card => {
      const pct = (card.used / card.limit) * 100;
      if (pct > 75) {
        list.push({ id: `c-${card.id}`, type: 'warning', title: `Cartão ${card.name}`, message: `Utilizado ${pct.toFixed(0)}% do limite total.` });
      }
    });

    // Alerta de Orçamento estourado
    categories.forEach(cat => {
      if (cat.budget > 0) {
        const totalSpent = transactions
          .filter(t => t.category === cat.name && t.type === 'despesa')
          .reduce((sum, t) => sum + Number(t.amount), 0);
        if (totalSpent > cat.budget) {
          list.push({ id: `b-${cat.id}`, type: 'danger', title: `Orçamento Estourado`, message: `A categoria ${cat.name} ultrapassou o limite em R$ ${(totalSpent - cat.budget).toFixed(2)}` });
        }
      }
    });

    return list;
  }, [cards, categories, transactions]);

  // === HANDLERS DE TRANSAÇÕES ===
  const handleOpenAddModal = (trans = null) => {
    if (trans) {
      setEditingTransaction(trans);
      setTransactionForm({ ...trans });
    } else {
      setEditingTransaction(null);
      setTransactionForm({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'despesa',
        category: 'Alimentação',
        account: accounts[0]?.id || '1',
        status: 'pago',
        recurrence: 'unica'
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (e) => {
    e.preventDefault();
    if (!transactionForm.description || !transactionForm.amount) {
      showToast('Preencha a descrição e o valor!');
      return;
    }

    const amountNum = parseFloat(transactionForm.amount);

    if (editingTransaction) {
      setTransactions(transactions.map(t => t.id === editingTransaction.id ? { ...transactionForm, amount: amountNum, id: t.id } : t));
      showToast('Transação atualizada com sucesso!');
    } else {
      const newTrans = {
        ...transactionForm,
        id: 't_' + Date.now(),
        amount: amountNum
      };
      setTransactions([newTrans, ...transactions]);
      
      // Atualizar saldo da conta simples se paga
      if (transactionForm.status === 'pago') {
        setAccounts(accounts.map(acc => {
          if (acc.id === transactionForm.account) {
            const mod = transactionForm.type === 'receita' ? amountNum : -amountNum;
            return { ...acc, balance: acc.balance + mod };
          }
          return acc;
        }));
      }

      showToast('Transação adicionada com sucesso!');
    }

    setIsModalOpen(false);
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Deseja realmente excluir esta transação?')) {
      setTransactions(transactions.filter(t => t.id !== id));
      showToast('Transação removida!');
    }
  };

  // Transações Filtradas
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'todos' || t.type === filterType;
      const matchesCategory = filterCategory === 'todas' || t.category === filterCategory;
      const matchesStatus = filterStatus === 'todos' || t.status === filterStatus;
      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    });
  }, [transactions, searchTerm, filterType, filterCategory, filterStatus]);

  // Exportar para CSV
  const handleExportCSV = () => {
    const headers = ['Data', 'Descricao', 'Tipo', 'Categoria', 'Valor', 'Status'];
    const rows = transactions.map(t => [t.date, `"${t.description}"`, t.type, t.category, t.amount, t.status]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinanControl_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exportação concluída com sucesso!');
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* TOPBAR / NAVBAR */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Wallet className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">FinanControl</h1>
              <p className="text-xs text-slate-400">Gestão Financeira Inteligente</p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleOpenAddModal()} 
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-3.5 py-2 rounded-xl flex items-center gap-2 text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Nova Transação</span>
            </button>
            
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`p-2.5 rounded-xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}
              title="Alternar Tema"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <div className={`border-b ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 overflow-x-auto no-scrollbar py-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Layers },
            { id: 'transactions', label: 'Transações', icon: ArrowRightLeft },
            { id: 'budgets', label: 'Orçamentos', icon: PieChartIcon },
            { id: 'accounts', label: 'Contas & Cartões', icon: CreditCard },
            { id: 'goals', label: 'Metas', icon: Target },
            { id: 'reports', label: 'Relatórios DRE', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  active 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm' 
                    : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ==================== DASHBOARD TAB ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* ALERTAS SYSTEM */}
            {alerts.length > 0 && (
              <div className="space-y-2">
                {alerts.map(al => (
                  <div key={al.id} className={`p-4 rounded-2xl border flex items-center justify-between ${al.type === 'danger' ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'}`}>
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm">{al.title}</h4>
                        <p className="text-xs opacity-90">{al.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* METRICS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className={`p-5 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Saldo Total</span>
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <Wallet className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold tracking-tight">R$ {metrics.totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                  <span className="text-emerald-400 flex items-center font-medium"><ArrowUpRight className="w-3.5 h-3.5" /> +4.2%</span> em relação ao mês anterior
                </p>
              </div>

              <div className={`p-5 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Receitas do Mês</span>
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-emerald-400 tracking-tight">R$ {metrics.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                <p className="text-xs text-slate-400 mt-2">Recebimentos confirmados</p>
              </div>

              <div className={`p-5 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Despesas do Mês</span>
                  <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-rose-400 tracking-tight">R$ {metrics.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                <p className="text-xs text-slate-400 mt-2">Gastos totais do período</p>
              </div>

              <div className={`p-5 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Balanço Líquido</span>
                  <div className={`p-2 rounded-xl ${metrics.netBalance >= 0 ? 'bg-teal-500/10 text-teal-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <h3 className={`text-2xl font-bold tracking-tight ${metrics.netBalance >= 0 ? 'text-teal-400' : 'text-rose-400'}`}>
                  R$ {metrics.netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
                <p className="text-xs text-slate-400 mt-2">Superávit mensal acumulado</p>
              </div>

              <div className={`p-5 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Taxa de Poupança</span>
                  <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-blue-400 tracking-tight">{metrics.savingsRate}%</h3>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: `${Math.min(metrics.savingsRate, 100)}%` }}></div>
                </div>
              </div>
            </div>

            {/* GRÁFICOS INTERATIVOS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Gráfico 1: Receitas vs Despesas (Barras) */}
              <div className={`lg:col-span-2 p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-base">Evolução de Fluxo de Caixa</h3>
                    <p className="text-xs text-slate-400">Comparativo mês a mês entre entradas e saídas</p>
                  </div>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyComparisonData}>
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v) => `R$${v}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', borderRadius: '12px' }} 
                        formatter={(val) => [`R$ ${val.toLocaleString('pt-BR')}`, '']}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />
                      <Bar dataKey="Receitas" fill="#10b981" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Despesas" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfico 2: Despesas por Categoria (Rosca) */}
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-base">Gastos por Categoria</h3>
                    <p className="text-xs text-slate-400">Distribuição percentual das despesas</p>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', borderRadius: '12px' }}
                        formatter={(val) => [`R$ ${val.toLocaleString('pt-BR')}`, 'Valor']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Legendas customizadas */}
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-24 overflow-y-auto no-scrollbar">
                  {categoryChartData.map((cat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }}></span>
                      <span className="truncate text-slate-400">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TRANSAÇÕES RECENTES (PAINEL RÁPIDO) */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base">Últimas Movimentações</h3>
                <button onClick={() => setActiveTab('transactions')} className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
                  Ver todas <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-slate-800/40">
                {transactions.slice(0, 4).map(t => (
                  <div key={t.id} className="py-3 flex items-center justify-between hover:bg-slate-800/20 rounded-xl px-2 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${t.type === 'receita' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {t.type === 'receita' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t.description}</p>
                        <p className="text-xs text-slate-400">{t.category} • {new Date(t.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold text-sm ${t.type === 'receita' ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {t.type === 'receita' ? '+' : '-'} R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className={`block text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full mt-0.5 w-max ml-auto ${t.status === 'pago' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== TRANSACTIONS TAB ==================== */}
        {activeTab === 'transactions' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* BARRA DE FILTROS E PESQUISA */}
            <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-4 items-center justify-between ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar transação..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-sm border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                >
                  <option value="todos">Todos os Tipos</option>
                  <option value="receita">Receitas</option>
                  <option value="despesa">Despesas</option>
                </select>

                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-sm border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                >
                  <option value="todas">Todas Categorias</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>

                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-sm border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                >
                  <option value="todos">Status: Todos</option>
                  <option value="pago">Pago / Recebido</option>
                  <option value="pendente">Pendente</option>
                </select>

                <button 
                  onClick={handleExportCSV}
                  className={`p-2 rounded-xl border flex items-center gap-2 text-sm font-medium ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'}`}
                  title="Exportar CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* TABELA DE TRANSAÇÕES */}
            <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className={`border-b text-xs uppercase font-semibold text-slate-400 ${darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <tr>
                      <th className="p-4">Descrição</th>
                      <th className="p-4">Data</th>
                      <th className="p-4">Categoria</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Valor</th>
                      <th className="p-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/30">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500">
                          Nenhuma transação encontrada.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map(t => (
                        <tr key={t.id} className="hover:bg-slate-800/20 transition-colors">
                          <td className="p-4 font-medium flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${t.type === 'receita' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {t.type === 'receita' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            </div>
                            <span>{t.description}</span>
                          </td>
                          <td className="p-4 text-slate-400 text-xs">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs border ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                              {t.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${t.status === 'pago' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                              {t.status === 'pago' ? 'Pago' : 'Pendente'}
                            </span>
                          </td>
                          <td className={`p-4 text-right font-bold ${t.type === 'receita' ? 'text-emerald-400' : 'text-slate-200'}`}>
                            {t.type === 'receita' ? '+' : '-'} R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => handleOpenAddModal(t)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteTransaction(t.id)} className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================== BUDGETS TAB ==================== */}
        {activeTab === 'budgets' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold">Orçamentos Mensais por Categoria</h2>
              <p className="text-sm text-slate-400">Estipule limites de gastos para manter a saúde financeira sob controle.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.filter(c => c.type === 'despesa').map(cat => {
                const spent = transactions
                  .filter(t => t.category === cat.name && t.type === 'despesa')
                  .reduce((sum, t) => sum + Number(t.amount), 0);
                
                const pct = cat.budget > 0 ? Math.min((spent / cat.budget) * 100, 100) : 0;
                const isOver = spent > cat.budget && cat.budget > 0;

                return (
                  <div key={cat.id} className={`p-6 rounded-2xl border relative overflow-hidden ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        <h3 className="font-bold text-base">{cat.name}</h3>
                      </div>
                      <span className="text-xs text-slate-400 font-semibold">Teto: R$ {cat.budget.toLocaleString('pt-BR')}</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Gasto: R$ {spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        <span className={isOver ? 'text-rose-400 font-bold' : 'text-slate-400'}>{pct.toFixed(0)}%</span>
                      </div>

                      {/* BARRA DE PROGRESSO COM INDICADORES DE CORES */}
                      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-2.5 rounded-full transition-all ${
                            pct > 90 ? 'bg-rose-500' : pct > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>

                    {isOver && (
                      <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>Atenção: Limite estourado em R$ {(spent - cat.budget).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== ACCOUNTS & CARDS TAB ==================== */}
        {activeTab === 'accounts' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* SEÇÃO CONTAS BANCÁRIAS */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Contas Bancárias & Carteiras</h2>
                  <p className="text-sm text-slate-400">Sua liquidez total e investimentos agregados</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {accounts.map(acc => (
                  <div key={acc.id} className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{acc.type}</span>
                      <div className={`w-8 h-8 rounded-xl ${acc.color} flex items-center justify-center text-white shadow-md`}>
                        <Wallet className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg">{acc.name}</h3>
                    <p className="text-2xl font-bold mt-2 text-emerald-400">R$ {acc.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SEÇÃO CARTÕES DE CRÉDITO */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">Cartões de Crédito</h2>
                <p className="text-sm text-slate-400">Acompanhamento de limite e fatura</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.map(card => {
                  const available = card.limit - card.used;
                  const pct = (card.used / card.limit) * 100;

                  return (
                    <div key={card.id} className={`p-6 rounded-2xl border bg-gradient-to-br ${card.color} text-white shadow-xl relative overflow-hidden`}>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-slate-300 font-semibold">Cartão de Crédito</p>
                          <h3 className="text-xl font-bold mt-0.5">{card.name}</h3>
                        </div>
                        <CreditCard className="w-8 h-8 text-white/70" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300">Fatura Atual</span>
                          <span className="font-bold">R$ {card.used.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div className="bg-white h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>

                        <div className="flex justify-between text-xs text-slate-300 pt-1">
                          <span>Disp: R$ {available.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          <span>Limite Total: R$ {card.limit.toLocaleString('pt-BR')}</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/10 flex justify-between text-xs text-slate-300">
                        <span>Fechamento: Dia {card.closingDay}</span>
                        <span>Vencimento: Dia {card.dueDay}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ==================== GOALS TAB ==================== */}
        {activeTab === 'goals' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold">Metas & Objetivos Financeiros</h2>
              <p className="text-sm text-slate-400">Planeje suas grandes conquistas de curto, médio e longo prazo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {goals.map(goal => {
                const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                const remaining = goal.targetAmount - goal.currentAmount;

                return (
                  <div key={goal.id} className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                        <Target className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full">
                        {pct.toFixed(0)}% Concluído
                      </span>
                    </div>

                    <h3 className="font-bold text-lg mb-1">{goal.name}</h3>
                    <p className="text-xs text-slate-400 mb-4">Meta para: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</p>

                    <div className="space-y-2 mb-4">
                      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Acumulado: R$ {goal.currentAmount.toLocaleString('pt-BR')}</span>
                        <span className="font-bold">Alvo: R$ {goal.targetAmount.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center">
                      <span>Falta economizar:</span>
                      <span className="font-bold text-slate-200">R$ {remaining > 0 ? remaining.toLocaleString('pt-BR') : 0}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== REPORTS TAB (DRE) ==================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold">Demonstrativo de Resultado (DRE Pessoal)</h2>
              <p className="text-sm text-slate-400">Resumo simplificado de performance financeira no período.</p>
            </div>

            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="space-y-4">
                
                {/* Receita Bruta */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <span className="font-bold text-base text-emerald-400">(+) Receita Bruta Total</span>
                  <span className="font-bold text-base text-emerald-400">R$ {metrics.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>

                {/* Gastos Essenciais / Fixos */}
                <div className="pl-4 space-y-2 border-b border-slate-800/40 pb-3">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>(-) Moradia & Serviços</span>
                    <span>R$ {transactions.filter(t => t.category === 'Moradia').reduce((s, t) => s + Number(t.amount), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>(-) Alimentação Básica</span>
                    <span>R$ {transactions.filter(t => t.category === 'Alimentação').reduce((s, t) => s + Number(t.amount), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>(-) Saúde & Seguro</span>
                    <span>R$ {transactions.filter(t => t.category === 'Saúde').reduce((s, t) => s + Number(t.amount), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Gastos Variáveis / Estilo de Vida */}
                <div className="pl-4 space-y-2 border-b border-slate-800/40 pb-3">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>(-) Lazer, Estilo & Outros</span>
                    <span>R$ {transactions.filter(t => t.category === 'Lazer & Estilo').reduce((s, t) => s + Number(t.amount), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>(-) Transporte & Mobilidade</span>
                    <span>R$ {transactions.filter(t => t.category === 'Transporte').reduce((s, t) => s + Number(t.amount), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Resultado Líquido */}
                <div className="flex justify-between items-center pt-2">
                  <span className="font-extrabold text-lg">(=) Saldo Líquido do Exercício</span>
                  <span className={`font-extrabold text-xl ${metrics.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    R$ {metrics.netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>

      {/* ==================== MODAL DE ADICIONAR / EDITAR TRANSAÇÃO ==================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-lg rounded-2xl p-6 border shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className="text-xl font-bold mb-4">
              {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
            </h3>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Tipo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransactionForm({ ...transactionForm, type: 'despesa' })}
                    className={`py-2 rounded-xl text-sm font-semibold border transition-all ${transactionForm.type === 'despesa' ? 'bg-rose-500/10 border-rose-500 text-rose-400' : 'border-slate-700 text-slate-400'}`}
                  >
                    Despesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionForm({ ...transactionForm, type: 'receita' })}
                    className={`py-2 rounded-xl text-sm font-semibold border transition-all ${transactionForm.type === 'receita' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-400'}`}
                  >
                    Receita
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Descrição</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Mercado, Salário, Internet" 
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Valor (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    placeholder="0,00" 
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Data</label>
                  <input 
                    type="date" 
                    required
                    value={transactionForm.date}
                    onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Categoria</label>
                  <select
                    value={transactionForm.category}
                    onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Status</label>
                  <select
                    value={transactionForm.status}
                    onChange={(e) => setTransactionForm({ ...transactionForm, status: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  >
                    <option value="pago">Pago / Recebido</option>
                    <option value="pendente">Pendente</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-5 p
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>y-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  Salvar Transação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
