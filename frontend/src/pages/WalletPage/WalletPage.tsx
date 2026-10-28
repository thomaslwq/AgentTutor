import { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  BadgePercent,
  ShoppingBag,
} from 'lucide-react';

import { useAppStore } from '@/store/AppContext';
import RechargeDialog, { type RechargePackage } from './RechargeDialog';

const RECHARGE_PACKAGES: RechargePackage[] = [
  { amount: 99, bonus: 5 },
  { amount: 299, bonus: 30, recommended: true },
  { amount: 699, bonus: 100 },
];

export default function WalletPage() {
  const { state } = useAppStore();
  const [rechargePkg, setRechargePkg] = useState<RechargePackage | null>(null);

  return (
    <div className="w-full py-8 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      {/* 余额卡 */}
      <div
        className="rounded-2xl shadow-md p-6 text-white flex flex-col sm:flex-row sm:items-center gap-4"
        style={{ background: 'linear-gradient(135deg, #1E3A5F, #E87722)' }}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            <Wallet className="size-4" />
            账户余额
          </div>
          <div className="text-4xl font-bold tracking-tight">¥{state.balance}</div>
          <p className="text-white/70 text-sm mt-2">充值后可用于购买课程 · 支持微信 / 支付宝</p>
        </div>
        <button
          onClick={() => setRechargePkg(RECHARGE_PACKAGES[1])}
          className="shrink-0 h-11 px-6 rounded-full bg-white text-primary text-sm font-semibold hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-1.5"
        >
          <Plus className="size-4" />
          立即充值
        </button>
      </div>

      {/* 充值套餐 */}
      <div className="rounded-2xl bg-card border border-border/40 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <BadgePercent className="size-5 text-accent" />
          <h2 className="font-semibold text-foreground">充值套餐</h2>
          <span className="text-xs text-muted-foreground">充得越多，送得越多</span>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {RECHARGE_PACKAGES.map((pkg) => (
            <button
              key={pkg.amount}
              onClick={() => setRechargePkg(pkg)}
              className={`relative rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                pkg.recommended
                  ? 'border-accent/50 bg-accent/5'
                  : 'border-border/60 bg-background/50 hover:border-accent/40'
              }`}
            >
              {pkg.recommended && (
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-accent text-white text-[11px] font-medium">
                  推荐
                </span>
              )}
              <div className="text-2xl font-bold text-foreground mb-1">¥{pkg.amount}</div>
              <div className="text-sm text-accent font-medium mb-0.5">赠 ¥{pkg.bonus}</div>
              <div className="text-xs text-muted-foreground">到账 ¥{pkg.amount + pkg.bonus}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 收支明细 */}
      <div className="rounded-2xl bg-card border border-border/40 shadow-sm p-5">
        <h2 className="font-semibold text-foreground mb-4">收支明细</h2>
        {state.transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">暂无收支记录</p>
        ) : (
          <div className="space-y-1">
            {state.transactions.map((tx) => {
              const isRecharge = tx.type === 'recharge';
              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <div
                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isRecharge ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'
                    }`}
                  >
                    {isRecharge ? (
                      <ArrowDownCircle className="size-5" />
                    ) : (
                      <ArrowUpCircle className="size-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{tx.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      {isRecharge ? (
                        <Wallet className="size-3" />
                      ) : (
                        <ShoppingBag className="size-3" />
                      )}
                      {tx.createdAt}
                      {isRecharge && tx.bonus ? ` · 含赠送 ¥${tx.bonus}` : ''}
                    </div>
                  </div>
                  <div
                    className={`shrink-0 text-sm font-bold ${
                      isRecharge ? 'text-success' : 'text-accent'
                    }`}
                  >
                    {isRecharge ? `+¥${tx.amount + (tx.bonus ?? 0)}` : `-¥${tx.amount}`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 充值弹窗 */}
      {rechargePkg && (
        <RechargeDialog
          pkg={rechargePkg}
          open={!!rechargePkg}
          onOpenChange={(v) => !v && setRechargePkg(null)}
        />
      )}
    </div>
  );
}
