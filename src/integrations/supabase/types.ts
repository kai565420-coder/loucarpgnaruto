export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      character_bag_items: {
        Row: {
          bag_type: string
          character_id: string
          created_at: string
          id: string
          is_papel_lacrado: boolean
          item_id: string
          quantidade: number
        }
        Insert: {
          bag_type?: string
          character_id: string
          created_at?: string
          id?: string
          is_papel_lacrado?: boolean
          item_id: string
          quantidade?: number
        }
        Update: {
          bag_type?: string
          character_id?: string
          created_at?: string
          id?: string
          is_papel_lacrado?: boolean
          item_id?: string
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "character_bag_items_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "character_sheets"
            referencedColumns: ["id"]
          },
        ]
      }
      character_jutsus: {
        Row: {
          character_id: string
          created_at: string
          id: string
          jutsu_id: string
          maestria_nivel: string
        }
        Insert: {
          character_id: string
          created_at?: string
          id?: string
          jutsu_id: string
          maestria_nivel?: string
        }
        Update: {
          character_id?: string
          created_at?: string
          id?: string
          jutsu_id?: string
          maestria_nivel?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_jutsus_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "character_sheets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_jutsus_jutsu_id_fkey"
            columns: ["jutsu_id"]
            isOneToOne: false
            referencedRelation: "jutsus"
            referencedColumns: ["id"]
          },
        ]
      }
      character_sheets: {
        Row: {
          acrobacia: number
          analise_combate: number
          bolsa_traseira_tamanho: string
          chakra: number
          chakra_max: number
          classe: string
          concentracao: number
          conhecimento_clas: number
          conhecimento_shinobi: number
          controle_chakra: number
          created_at: string
          deslocamento: number
          destreza: number
          dinheiro: number
          elementos: string
          estrategia_tatica: number
          forca_bruta: number
          forca_fisica: number
          fortitude: number
          fuinjutsu: number
          furtividade: number
          genjutsu: number
          id: string
          idade: string
          imagem_url: string | null
          imobilizacao: number
          iniciativa: number
          intimidacao: number
          inventario: string
          ip_address: string
          kenjutsu: number
          maestria_agua: string
          maestria_fogo: string
          maestria_raio: string
          maestria_terra: string
          maestria_vento: string
          moldagem_elemental: number
          ninjutsu_medico: number
          nome: string
          pontos_acao: number
          rank_ninja: string
          recuperacao: number
          reflexos_ninja: number
          resistencia_fisica: number
          resistencia_genjutsu: number
          sabotagem: number
          sanidade: number
          sanidade_max: number
          selos_manuais: string
          sensorial: number
          shurikenjutsu: number
          sobrevivencia: number
          taijutsu: number
          talento: string
          tolerancia_dor: number
          updated_at: string
          vida: number
          vida_max: number
          vontade_ninja: number
        }
        Insert: {
          acrobacia?: number
          analise_combate?: number
          bolsa_traseira_tamanho?: string
          chakra?: number
          chakra_max?: number
          classe?: string
          concentracao?: number
          conhecimento_clas?: number
          conhecimento_shinobi?: number
          controle_chakra?: number
          created_at?: string
          deslocamento?: number
          destreza?: number
          dinheiro?: number
          elementos?: string
          estrategia_tatica?: number
          forca_bruta?: number
          forca_fisica?: number
          fortitude?: number
          fuinjutsu?: number
          furtividade?: number
          genjutsu?: number
          id?: string
          idade?: string
          imagem_url?: string | null
          imobilizacao?: number
          iniciativa?: number
          intimidacao?: number
          inventario?: string
          ip_address: string
          kenjutsu?: number
          maestria_agua?: string
          maestria_fogo?: string
          maestria_raio?: string
          maestria_terra?: string
          maestria_vento?: string
          moldagem_elemental?: number
          ninjutsu_medico?: number
          nome: string
          pontos_acao?: number
          rank_ninja?: string
          recuperacao?: number
          reflexos_ninja?: number
          resistencia_fisica?: number
          resistencia_genjutsu?: number
          sabotagem?: number
          sanidade?: number
          sanidade_max?: number
          selos_manuais?: string
          sensorial?: number
          shurikenjutsu?: number
          sobrevivencia?: number
          taijutsu?: number
          talento?: string
          tolerancia_dor?: number
          updated_at?: string
          vida?: number
          vida_max?: number
          vontade_ninja?: number
        }
        Update: {
          acrobacia?: number
          analise_combate?: number
          bolsa_traseira_tamanho?: string
          chakra?: number
          chakra_max?: number
          classe?: string
          concentracao?: number
          conhecimento_clas?: number
          conhecimento_shinobi?: number
          controle_chakra?: number
          created_at?: string
          deslocamento?: number
          destreza?: number
          dinheiro?: number
          elementos?: string
          estrategia_tatica?: number
          forca_bruta?: number
          forca_fisica?: number
          fortitude?: number
          fuinjutsu?: number
          furtividade?: number
          genjutsu?: number
          id?: string
          idade?: string
          imagem_url?: string | null
          imobilizacao?: number
          iniciativa?: number
          intimidacao?: number
          inventario?: string
          ip_address?: string
          kenjutsu?: number
          maestria_agua?: string
          maestria_fogo?: string
          maestria_raio?: string
          maestria_terra?: string
          maestria_vento?: string
          moldagem_elemental?: number
          ninjutsu_medico?: number
          nome?: string
          pontos_acao?: number
          rank_ninja?: string
          recuperacao?: number
          reflexos_ninja?: number
          resistencia_fisica?: number
          resistencia_genjutsu?: number
          sabotagem?: number
          sanidade?: number
          sanidade_max?: number
          selos_manuais?: string
          sensorial?: number
          shurikenjutsu?: number
          sobrevivencia?: number
          taijutsu?: number
          talento?: string
          tolerancia_dor?: number
          updated_at?: string
          vida?: number
          vida_max?: number
          vontade_ninja?: number
        }
        Relationships: []
      }
      items: {
        Row: {
          created_at: string
          descricao: string
          id: string
          imagem_url: string | null
          ip_address: string
          nome: string
          peso: number
          valor: string
        }
        Insert: {
          created_at?: string
          descricao?: string
          id?: string
          imagem_url?: string | null
          ip_address: string
          nome: string
          peso?: number
          valor?: string
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          imagem_url?: string | null
          ip_address?: string
          nome?: string
          peso?: number
          valor?: string
        }
        Relationships: []
      }
      jutsus: {
        Row: {
          categoria: string
          created_at: string
          id: string
          imagem_url: string | null
          informacoes: string
          ip_address: string
          nome: string
        }
        Insert: {
          categoria?: string
          created_at?: string
          id?: string
          imagem_url?: string | null
          informacoes?: string
          ip_address: string
          nome: string
        }
        Update: {
          categoria?: string
          created_at?: string
          id?: string
          imagem_url?: string | null
          informacoes?: string
          ip_address?: string
          nome?: string
        }
        Relationships: []
      }
      personalizados: {
        Row: {
          created_at: string
          descricao: string
          id: string
          imagem_url: string | null
          ip_address: string
          nome: string
          peso: number
          valor: string
        }
        Insert: {
          created_at?: string
          descricao?: string
          id?: string
          imagem_url?: string | null
          ip_address: string
          nome: string
          peso?: number
          valor?: string
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          imagem_url?: string | null
          ip_address?: string
          nome?: string
          peso?: number
          valor?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
