"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { $Enums } from "@prisma/client"

type Checked = DropdownMenuCheckboxItemProps["checked"]

interface UserMenuProps {
  role: $Enums.MemberRole
}

export function UserMenu({
  role
}: UserMenuProps) {
  const buyTicket = () => {

  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[10rem]">
        <DropdownMenuLabel>
          {role == 'ADMIN' ? 'Admin' : 'User'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {role === 'ADMIN' 
          ? (
            <>
              <Link href={'/admin/users'}>
                <DropdownMenuItem>
                    Users
                </DropdownMenuItem>
              </Link>
              <Link href={'/admin/rooms'}>
                <DropdownMenuItem>
                    Rooms
                </DropdownMenuItem>
              </Link>
            </>)
          : (
            <>
              <Link href={'/user/account'}>
                <DropdownMenuItem>
                    Account
                </DropdownMenuItem>
              </Link>
            </>)
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
