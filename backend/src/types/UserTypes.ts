
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  games: Game[]; 
}

export interface Game {
  id: string;
  gameState: any;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  users: User[];  
}


export interface UsernamePasswordInput {
  username: string
  email: string
  password: string
}