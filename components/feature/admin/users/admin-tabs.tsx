"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface AdminTabsProps {
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}

export function AdminTabs({ value, onChange, children }: AdminTabsProps) {
  return (
    <div className="relative flex items-center gap-1 border-b">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null
        const props = child.props as TabItemProps
        return (
          <TabButton
            active={props.value === value}
            onClick={() => onChange(props.value)}
            icon={props.icon}
          >
            {props.label}
          </TabButton>
        )
      })}
    </div>
  )
}

interface TabButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  icon?: React.ReactNode
}

function TabButton({ active, onClick, children, icon }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground/80"
      )}
    >
      {icon && (
        <span className={cn("transition-colors", active && "text-primary")}>
          {icon}
        </span>
      )}
      {children}
      {active && (
        <motion.div
          layoutId="admin-tab-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  )
}

interface TabItemProps {
  value: string
  label: string
  icon?: React.ReactNode
}

export function AdminTabItem(_props: TabItemProps) {
  return null
}

interface TabContentProps {
  value: string
  current: string
  children: React.ReactNode
}

export function AdminTabContent({ value, current, children }: TabContentProps) {
  return (
    <AnimatePresence mode="wait">
      {value === current && (
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
