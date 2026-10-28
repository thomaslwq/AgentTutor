import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AlertTriangle, Wallet } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppStore } from '@/store/AppContext';
import type { ICourse } from '@/data/courses';

interface PurchaseDialogProps {
  course: ICourse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PurchaseDialog({ course, open, onOpenChange }: PurchaseDialogProps) {
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();

  const sufficient = state.balance >= course.price;
  const shortage = course.price - state.balance;

  const handlePay = () => {
    if (!sufficient) return;
    dispatch({
      type: 'PURCHASE_COURSE',
      courseId: course.id,
      title: course.title,
      amount: course.price,
    });
    toast.success('购买成功！点击「开始学习」进入课堂');
    onOpenChange(false);
  };

  const goWallet = () => {
    onOpenChange(false);
    navigate('/wallet');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>确认购买课程</DialogTitle>
          <DialogDescription>购买后即可开始学习，导师将全程引导</DialogDescription>
        </DialogHeader>

        {/* 课程信息 */}
        <div className="rounded-xl bg-secondary/60 p-4 space-y-2">
          <div className="font-medium text-foreground text-sm leading-snug">{course.title}</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-accent">¥{course.price}</span>
            {course.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ¥{course.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* 余额信息 */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground inline-flex items-center gap-1.5">
            <Wallet className="size-4" />
            当前余额
          </span>
          <span className="font-semibold text-foreground">¥{state.balance}</span>
        </div>

        {sufficient ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">支付后余额</span>
            <span className="font-semibold text-foreground">¥{state.balance - course.price}</span>
          </div>
        ) : (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 flex items-start gap-2.5">
            <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="text-destructive font-medium">余额不足，还差 ¥{shortage}</div>
              <div className="text-muted-foreground mt-0.5">可先前往钱包充值后再购买</div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {sufficient ? (
            <>
              <button
                onClick={() => onOpenChange(false)}
                className="h-10 px-5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
              >
                取消
              </button>
              <button
                onClick={handlePay}
                className="h-10 px-5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                确认支付 ¥{course.price}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onOpenChange(false)}
                className="h-10 px-5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
              >
                暂不购买
              </button>
              <button
                onClick={goWallet}
                className="h-10 px-5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                去充值
              </button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
