"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../dashboard.module.css";

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
    <div className={styles.dashContainer}>
      <header className={styles.dashHeader}>
        <h1>Nova Avaliação de Paciente</h1>
      </header>

      <div className={styles.dashContent}>
        <form onSubmit={handleSubmit} className={styles.dashForm}>
          <div className={styles.formGroup}>
            <label>Nome Completo</label>
            <input type="text" name="nome" required />
          </div>

          <div className={styles.formGroup}>
            <label>Telefone</label>
            <input type="text" name="telefone" />
          </div>

          <div className={styles.formGroup}>
            <label>Endereço Completo</label>
            <input type="text" name="endereco" />
          </div>

          <div className={styles.formGroup}>
            <label>Diagnóstico</label>
            <input type="text" name="diagnostico" />
          </div>

          {/* Novos campos adicionados no Prisma para Avaliação Inicial */}
          <div className={styles.formGroup}>
            <label>Alergias (Se houver)</label>
            <input type="text" name="alergias" placeholder="Ex: Dipirona, Penicilina..." />
          </div>

          <div className={styles.formGroup}>
            <label>Grau de Dependência</label>
            <select name="grauDependencia">
              <option value="">Selecione...</option>
              <option value="Total">Total (Acamado, depende p/ tudo)</option>
              <option value="Parcial">Parcial (Precisa de auxílio)</option>
              <option value="Independente">Independente (Apenas supervisão)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Medicações Contínuas</label>
            <textarea name="medicacoes" rows="3" placeholder="Liste as medicações e horários..."></textarea>
          </div>

          <div className={styles.formGroup}>
            <label>Plano de Cuidados (Observações de Enfermagem)</label>
            <textarea name="observacoesEnfermagem" rows="4" placeholder="Descreva os cuidados específicos que a equipe deverá ter..."></textarea>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Salvando de forma segura..." : "Salvar Avaliação"}
          </button>
        </form>
      </div>
    </div>
  );
}
