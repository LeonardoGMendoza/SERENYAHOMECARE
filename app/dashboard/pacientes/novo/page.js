"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashLayout from "../../../../components/DashLayout";
import styles from "./novo.module.css";

export default function NovoPaciente() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Avaliação Inicial salva com segurança!");
        router.push("/dashboard/pacientes");
      } else {
        alert("Erro ao salvar paciente.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Nova Avaliação de Paciente</h1>
          <p className={styles.subtitle}>Preencha o formulário para cadastrar o paciente e gerar o Plano de Cuidados.</p>
        </header>

        <form onSubmit={handleSubmit} className={styles.formCard}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome Completo</label>
              <input type="text" name="nome" className={styles.input} required placeholder="Nome do paciente" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Telefone</label>
              <input type="text" name="telefone" className={styles.input} placeholder="(00) 00000-0000" />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Endereço Completo</label>
              <input type="text" name="endereco" className={styles.input} placeholder="Rua, Número, Bairro, CEP" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>E-mail do Familiar / Responsável</label>
              <input type="email" name="emailFamiliar" className={styles.input} placeholder="email@exemplo.com" />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Diagnóstico</label>
              <input type="text" name="diagnostico" className={styles.input} placeholder="Diagnóstico principal" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Alergias (Se houver)</label>
              <input type="text" name="alergias" className={styles.input} placeholder="Ex: Dipirona, Penicilina..." />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Grau de Dependência</label>
              <select name="grauDependencia" className={styles.select}>
                <option value="">Selecione...</option>
                <option value="Total">Total (Acamado, depende p/ tudo)</option>
                <option value="Parcial">Parcial (Precisa de auxílio)</option>
                <option value="Independente">Independente (Apenas supervisão)</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Medicações Contínuas</label>
            <textarea name="medicacoes" className={styles.textarea} placeholder="Liste as medicações e horários..."></textarea>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Plano de Cuidados (Observações)</label>
            <textarea name="observacoesEnfermagem" className={styles.textarea} placeholder="Descreva os cuidados específicos que a equipe deverá ter..."></textarea>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Salvando com segurança..." : "Salvar Avaliação"}
          </button>
        </form>
      </div>
    </DashLayout>
  );
}
