import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { annee } = await params
  return {
    title: `Millésimes ${annee} — Référence Crescendo`,
    description: `Les Millésimes ${annee} de Crescendo Magazine : les enregistrements primés par la rédaction.`,
  }
}

const EDITOS = {
  2025: {
    sous_titre: "5ᵉ édition",
    paragraphes: [
      "Cette édition 2025 des Millésimes est particulière : en janvier dernier, notre cofondatrice <strong>Michelle Debra (1950-2025)</strong> nous a quittés. Crescendo Magazine avait été fondé en 1993 par Bernadette Beyne (1949-2018) et Michelle Debra, initiative novatrice et visionnaire depuis la Belgique francophone.",
      "Pour faire perdurer leur esprit pionnier, la rédaction a créé le <strong>Prix Bernadette Beyne et Michelle Debra</strong>, qui récompense une initiative exemplative du dynamisme de la scène musicale. Ce premier prix est décerné à l'enregistrement consacré aux Symphonies n°1 et n°2 d'Elsa Barraine par le WDR Sinfonieorchester sous la direction d'Elena Schwarz.",
      "L'enregistrement de l'année met en relief le magistral <strong>Coro</strong> de Luciano Berio associé à <strong>Automatones</strong> de Vito Žuraj, qui s'impose comme l'un des grands chefs-d'œuvre des années 2020.",
    ],
  },
  2024: {
    sous_titre: "4ᵉ édition",
    paragraphes: [
      "Pour ce cru 2024, la rédaction présente un <strong>nouveau prix consacré à l'art des compositrices</strong> : le Millésime Matrimoine, qui ambitionne de mettre en avant une initiative déclinée en phonographe, livre, partition ou série de concerts. Ce premier Millésime récompense un album CPO consacré à Johanna Senfter par l'Else Ensemble.",
      "Le Millésime « enregistrement de l'année » récompense le coffret Erato en hommage à l'art de la grande <strong>Catherine Collard</stro
