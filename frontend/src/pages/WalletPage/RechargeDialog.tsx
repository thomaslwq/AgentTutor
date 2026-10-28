import { useState } from 'react';
import { toast } from 'sonner';
import { QrCode } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAppStore } from '@/store/AppContext';
import type { PayMethod } from '@/store/appStore';

export interface RechargePackage {
  amount: number;
  bonus: number;
  recommended?: boolean;
}

interface RechargeDialogProps {
  pkg: RechargePackage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RechargeDialog({ pkg, open, onOpenChange }: RechargeDialogProps) {
  const { dispatch } = useAppStore();
  const [method, setMethod] = useState<PayMethod>('wechat');

  const total = pkg.amount + pkg.bonus;

  const handlePaid = () => {
    dispatch({ type: 'TOP_UP', amount: pkg.amount, bonus: pkg.bonus, method });
    toast.success(`充值成功，到账 ¥${total}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>扫码充值</DialogTitle>
          <DialogDescription>选择支付方式，扫码完成支付（模拟环境）</DialogDescription>
        </DialogHeader>

        {/* 金额信息 */}
        <div className="rounded-xl bg-secondary/60 p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-0.5">充值金额</div>
            <div className="text-2xl font-bold text-foreground">¥{pkg.amount}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-accent font-medium">赠 ¥{pkg.bonus}</div>
            <div className="text-sm text-muted-foreground mt-0.5">到账 ¥{total}</div>
          </div>
        </div>

        {/* 支付方式 */}
        <Tabs value={method} onValueChange={(v) => setMethod(v as PayMethod)}>
          <TabsList className="grid w-full grid-cols-2 h-10">
            <TabsTrigger value="wechat" className="rounded-full">微信支付</TabsTrigger>
            <TabsTrigger value="alipay" className="rounded-full">支付宝</TabsTrigger>
          </TabsList>
          {(['wechat', 'alipay'] as const).map((m) => (
            <TabsContent key={m} value={m} className="mt-4">
              <div className="w-44 h-44 mx-auto rounded-xl border border-border bg-white flex items-center justify-center relative overflow-hidden">
                <div
                  className="absolute inset-3 opacity-50"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, #1E3A5F 1px, transparent 1px), linear-gradient(#1E3A5F 1px, transparent 1px)',
                    backgroundSize: '8px 8px',
                  }}
                />
                <div className="relative bg-white rounded-lg px-3 py-2 flex flex-col items-center gap-1 shadow-sm">
                  <QrCode className="size-5 text-primary" />
                  <span className="text-xs font-medium text-foreground">
                    {m === 'wechat' ? '微信扫码支付' : '支付宝扫码支付'}
                  </span>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-3">
                请使用{m === 'wechat' ? '微信' : '支付宝'}扫一扫完成付款
              </p>
            </TabsContent>
          ))}
        </Tabs>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="h-10 px-5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
          >
            取消
          </button>
          <button
            onClick={handlePaid}
            className="h-10 px-5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            模拟支付成功
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
