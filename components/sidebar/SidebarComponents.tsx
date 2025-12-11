
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { MoreHorizontal, LogOut, User, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuContent } from '../ui/DropdownMenu';

export const SidebarUserDropdown = () => {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start px-2 h-auto py-2 hover:bg-slate-100">
                <div className="flex items-center gap-3 text-left">
                    <Avatar className="h-8 w-8 rounded-lg border">
                        <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80" />
                        <AvatarFallback>MF</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium leading-none truncate">The Miller Family</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">m.miller@givehope.org</p>
                    </div>
                    <MoreHorizontal className="h-4 w-4 ml-auto text-muted-foreground" />
                </div>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56" side="top" sideOffset={8}>
            <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" /> Log Out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );
};
