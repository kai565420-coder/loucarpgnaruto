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
      bingo_entries: {
        Row: {
          afiliacao_atual: string
          afinidades_elementais: string
          alcunha: string
          created_at: string
          crimes_conhecidos: string
          estilo_combate: string
          id: string
          imagem_url: string | null
          instrucoes_captura: string
          invocacoes: string
          kekkei_genkai: string
          nivel_sigilo: string
          nome: string
          pontos_fortes: string
          pontos_fracos: string
          rank_ameaca: string
          recompensa: string
          situacao: string
          tecnicas_conhecidas: string
          ultima_localizacao: string
          updated_at: string
          vila_origem: string
          vila_registro: string
        }
        Insert: {
          afiliacao_atual?: string
          afinidades_elementais?: string
          alcunha?: string
          created_at?: string
          crimes_conhecidos?: string
          estilo_combate?: string
          id?: string
          imagem_url?: string | null
          instrucoes_captura?: string
          invocacoes?: string
          kekkei_genkai?: string
          nivel_sigilo?: string
          nome: string
          pontos_fortes?: string
          pontos_fracos?: string
          rank_ameaca?: string
          recompensa?: string
          situacao?: string
          tecnicas_conhecidas?: string
          ultima_localizacao?: string
          updated_at?: string
          vila_origem?: string
          vila_registro?: string
        }
        Update: {
          afiliacao_atual?: string
          afinidades_elementais?: string
          alcunha?: string
          created_at?: string
          crimes_conhecidos?: string
          estilo_combate?: string
          id?: string
          imagem_url?: string | null
          instrucoes_captura?: string
          invocacoes?: string
          kekkei_genkai?: string
          nivel_sigilo?: string
          nome?: string
          pontos_fortes?: string
          pontos_fracos?: string
          rank_ameaca?: string
          recompensa?: string
          situacao?: string
          tecnicas_conhecidas?: string
          ultima_localizacao?: string
          updated_at?: string
          vila_origem?: string
          vila_registro?: string
        }
        Relationships: []
      }
      character_bag_items: {
        Row: {
          bag_type: string
          character_id: string
          created_at: string
          durabilidade: number | null
          id: string
          is_papel_lacrado: boolean
          item_id: string
          quantidade: number
        }
        Insert: {
          bag_type?: string
          character_id: string
          created_at?: string
          durabilidade?: number | null
          id?: string
          is_papel_lacrado?: boolean
          item_id: string
          quantidade?: number
        }
        Update: {
          bag_type?: string
          character_id?: string
          created_at?: string
          durabilidade?: number | null
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
          inv_chakra: number | null
          inv_sanidade: number | null
          inv_vida: number | null
          jutsu_id: string
          maestria_nivel: string
        }
        Insert: {
          character_id: string
          created_at?: string
          id?: string
          inv_chakra?: number | null
          inv_sanidade?: number | null
          inv_vida?: number | null
          jutsu_id: string
          maestria_nivel?: string
        }
        Update: {
          character_id?: string
          created_at?: string
          id?: string
          inv_chakra?: number | null
          inv_sanidade?: number | null
          inv_vida?: number | null
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
          afinidade_agua: number
          afinidade_fogo: number
          afinidade_raio: number
          afinidade_terra: number
          afinidade_vento: number
          alcunha: string
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
          dominio_agua: number
          dominio_fogo: number
          dominio_raio: number
          dominio_terra: number
          dominio_vento: number
          elementos: string
          est_adaptacao: number
          est_bukijutsu: number
          est_controle_chakra: number
          est_destreza: number
          est_forca_fisica: number
          est_fuinjutsu: number
          est_infiltracao: number
          est_int_combate: number
          est_inteligencia: number
          est_kenjutsu: number
          est_ninjutsu: number
          est_qtd_chakra: number
          est_resistencia: number
          est_selos_mao: number
          est_taijutsu: number
          est_trabalho_equipe: number
          est_velocidade: number
          est_vigor: number
          est_yang: number
          est_yin: number
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
          kenjutsu: number
          maestria_agua: string
          maestria_fogo: string
          maestria_raio: string
          maestria_terra: string
          maestria_vento: string
          missoes_a: number
          missoes_b: number
          missoes_c: number
          missoes_d: number
          missoes_s: number
          moldagem_elemental: number
          ninjutsu_medico: number
          nome: string
          pontos_acao: number
          rank_ninja: string
          reconhecimento: string
          recuperacao: number
          reflexos_ninja: number
          registro_ninja: string
          reputacao: string
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
          user_id: string | null
          vida: number
          vida_max: number
          vontade_ninja: number
        }
        Insert: {
          acrobacia?: number
          afinidade_agua?: number
          afinidade_fogo?: number
          afinidade_raio?: number
          afinidade_terra?: number
          afinidade_vento?: number
          alcunha?: string
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
          dominio_agua?: number
          dominio_fogo?: number
          dominio_raio?: number
          dominio_terra?: number
          dominio_vento?: number
          elementos?: string
          est_adaptacao?: number
          est_bukijutsu?: number
          est_controle_chakra?: number
          est_destreza?: number
          est_forca_fisica?: number
          est_fuinjutsu?: number
          est_infiltracao?: number
          est_int_combate?: number
          est_inteligencia?: number
          est_kenjutsu?: number
          est_ninjutsu?: number
          est_qtd_chakra?: number
          est_resistencia?: number
          est_selos_mao?: number
          est_taijutsu?: number
          est_trabalho_equipe?: number
          est_velocidade?: number
          est_vigor?: number
          est_yang?: number
          est_yin?: number
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
          kenjutsu?: number
          maestria_agua?: string
          maestria_fogo?: string
          maestria_raio?: string
          maestria_terra?: string
          maestria_vento?: string
          missoes_a?: number
          missoes_b?: number
          missoes_c?: number
          missoes_d?: number
          missoes_s?: number
          moldagem_elemental?: number
          ninjutsu_medico?: number
          nome: string
          pontos_acao?: number
          rank_ninja?: string
          reconhecimento?: string
          recuperacao?: number
          reflexos_ninja?: number
          registro_ninja?: string
          reputacao?: string
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
          user_id?: string | null
          vida?: number
          vida_max?: number
          vontade_ninja?: number
        }
        Update: {
          acrobacia?: number
          afinidade_agua?: number
          afinidade_fogo?: number
          afinidade_raio?: number
          afinidade_terra?: number
          afinidade_vento?: number
          alcunha?: string
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
          dominio_agua?: number
          dominio_fogo?: number
          dominio_raio?: number
          dominio_terra?: number
          dominio_vento?: number
          elementos?: string
          est_adaptacao?: number
          est_bukijutsu?: number
          est_controle_chakra?: number
          est_destreza?: number
          est_forca_fisica?: number
          est_fuinjutsu?: number
          est_infiltracao?: number
          est_int_combate?: number
          est_inteligencia?: number
          est_kenjutsu?: number
          est_ninjutsu?: number
          est_qtd_chakra?: number
          est_resistencia?: number
          est_selos_mao?: number
          est_taijutsu?: number
          est_trabalho_equipe?: number
          est_velocidade?: number
          est_vigor?: number
          est_yang?: number
          est_yin?: number
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
          kenjutsu?: number
          maestria_agua?: string
          maestria_fogo?: string
          maestria_raio?: string
          maestria_terra?: string
          maestria_vento?: string
          missoes_a?: number
          missoes_b?: number
          missoes_c?: number
          missoes_d?: number
          missoes_s?: number
          moldagem_elemental?: number
          ninjutsu_medico?: number
          nome?: string
          pontos_acao?: number
          rank_ninja?: string
          reconhecimento?: string
          recuperacao?: number
          reflexos_ninja?: number
          registro_ninja?: string
          reputacao?: string
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
          user_id?: string | null
          vida?: number
          vida_max?: number
          vontade_ninja?: number
        }
        Relationships: []
      }
      invocacao_jutsus: {
        Row: {
          character_jutsu_id: string
          created_at: string
          id: string
          jutsu_id: string
          maestria_nivel: string
        }
        Insert: {
          character_jutsu_id: string
          created_at?: string
          id?: string
          jutsu_id: string
          maestria_nivel?: string
        }
        Update: {
          character_jutsu_id?: string
          created_at?: string
          id?: string
          jutsu_id?: string
          maestria_nivel?: string
        }
        Relationships: []
      }
      items: {
        Row: {
          created_at: string
          descricao: string
          id: string
          imagem_url: string | null
          nome: string
          peso: number
          valor: string
        }
        Insert: {
          created_at?: string
          descricao?: string
          id?: string
          imagem_url?: string | null
          nome: string
          peso?: number
          valor?: string
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          imagem_url?: string | null
          nome?: string
          peso?: number
          valor?: string
        }
        Relationships: []
      }
      jutsus: {
        Row: {
          alcance: string
          categoria: string
          created_at: string
          custo_invocacao: number
          dt_captura: number
          id: string
          imagem_url: string | null
          informacoes: string
          inv_analise_combate: number
          inv_chakra_max: number
          inv_concentracao: number
          inv_conhecimento_clas: number
          inv_conhecimento_shinobi: number
          inv_controle_chakra: number
          inv_destreza: number
          inv_forca_fisica: number
          inv_furtividade: number
          inv_genjutsu: number
          inv_intimidacao: number
          inv_kenjutsu: number
          inv_moldagem_elemental: number
          inv_reflexos_ninja: number
          inv_resistencia_genjutsu: number
          inv_sabotagem: number
          inv_sanidade_max: number
          inv_shurikenjutsu: number
          inv_taijutsu: number
          inv_vida_max: number
          nome: string
          qtd_selos: number
        }
        Insert: {
          alcance?: string
          categoria?: string
          created_at?: string
          custo_invocacao?: number
          dt_captura?: number
          id?: string
          imagem_url?: string | null
          informacoes?: string
          inv_analise_combate?: number
          inv_chakra_max?: number
          inv_concentracao?: number
          inv_conhecimento_clas?: number
          inv_conhecimento_shinobi?: number
          inv_controle_chakra?: number
          inv_destreza?: number
          inv_forca_fisica?: number
          inv_furtividade?: number
          inv_genjutsu?: number
          inv_intimidacao?: number
          inv_kenjutsu?: number
          inv_moldagem_elemental?: number
          inv_reflexos_ninja?: number
          inv_resistencia_genjutsu?: number
          inv_sabotagem?: number
          inv_sanidade_max?: number
          inv_shurikenjutsu?: number
          inv_taijutsu?: number
          inv_vida_max?: number
          nome: string
          qtd_selos?: number
        }
        Update: {
          alcance?: string
          categoria?: string
          created_at?: string
          custo_invocacao?: number
          dt_captura?: number
          id?: string
          imagem_url?: string | null
          informacoes?: string
          inv_analise_combate?: number
          inv_chakra_max?: number
          inv_concentracao?: number
          inv_conhecimento_clas?: number
          inv_conhecimento_shinobi?: number
          inv_controle_chakra?: number
          inv_destreza?: number
          inv_forca_fisica?: number
          inv_furtividade?: number
          inv_genjutsu?: number
          inv_intimidacao?: number
          inv_kenjutsu?: number
          inv_moldagem_elemental?: number
          inv_reflexos_ninja?: number
          inv_resistencia_genjutsu?: number
          inv_sabotagem?: number
          inv_sanidade_max?: number
          inv_shurikenjutsu?: number
          inv_taijutsu?: number
          inv_vida_max?: number
          nome?: string
          qtd_selos?: number
        }
        Relationships: []
      }
      personalizados: {
        Row: {
          created_at: string
          descricao: string
          durabilidade_inicial: number
          id: string
          imagem_url: string | null
          nome: string
          peso: number
          valor: string
        }
        Insert: {
          created_at?: string
          descricao?: string
          durabilidade_inicial?: number
          id?: string
          imagem_url?: string | null
          nome: string
          peso?: number
          valor?: string
        }
        Update: {
          created_at?: string
          descricao?: string
          durabilidade_inicial?: number
          id?: string
          imagem_url?: string | null
          nome?: string
          peso?: number
          valor?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      owns_sheet: { Args: { _sheet_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
