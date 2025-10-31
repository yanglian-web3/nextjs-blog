"usr client"

import {Dialog} from "@ark-ui/react";
import IconWarning from "../icons/icon-warning";

export type AlertType = 'warning' | 'error' | 'info'

export interface AlertConfig {
  title: string
  message: string
  type: AlertType
}

interface AlertProps {
  open: boolean
  updateOpen: (open: boolean) => void
  alertConfig: AlertConfig
  showDialogFooter: boolean
}

export default function BlogAlert({open, updateOpen, alertConfig, showDialogFooter}: AlertProps) {


    return  <Dialog.Root open={open} onOpenChange={(e) => updateOpen(e.open)}>
      <Dialog.Backdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
      <Dialog.Positioner className="fixed inset-0 flex items-center justify-center p-4 z-[100]">
        <Dialog.Content className={`bg-white rounded-lg shadow-xl w-full max-w-md p-6`}>
          <Dialog.Title className={`text-lg font-semibold mb-2`}>
            <div className={`flex items-center gap-2`}>
              <IconWarning/>
              {alertConfig.title}
            </div>
          </Dialog.Title>
          <Dialog.Description className={`mb-6`}>
            {alertConfig.message}
          </Dialog.Description>
          {
            showDialogFooter ?                   <div className="flex justify-end">
              <Dialog.CloseTrigger asChild>
                <button className={`px-6 py-2 text-white rounded-lg transition-colors theme-bg`}>
                  确定
                </button>
              </Dialog.CloseTrigger>
            </div> : null
          }
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
}