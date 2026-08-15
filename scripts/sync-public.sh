#!/bin/bash
set -e

# Aktuellen Branch ermitteln
CURRENT_BRANCH=$(git branch --show-current)

# Prüfen, ob der aktuelle Branch synchronisiert werden darf
if [[ "$CURRENT_BRANCH" != "dev" && "$CURRENT_BRANCH" != "staging" && "$CURRENT_BRANCH" != "main" ]]; then
  echo "❌ Fehler: Nur 'dev', 'staging' und 'main' können zum öffentlichen Repo synchronisiert werden."
  exit 1
fi

PUBLIC_BRANCH="public-$CURRENT_BRANCH"

echo "🔄 Synchronisiere '$CURRENT_BRANCH' in das öffentliche Repository..."

# Sicherstellen, dass keine uncommitteten Änderungen existieren
if [[ -n $(git status --porcelain) ]]; then
  echo "❌ Fehler: Du hast uncommittete Änderungen. Bitte committe oder stashe diese zuerst."
  exit 1
fi

# Auf den sauberen public Branch wechseln
git checkout $PUBLIC_BRANCH

# Den genauen Zustand des privaten Branches kopieren
git restore --source=$CURRENT_BRANCH --worktree --staged .

# Das Skript selbst und den Eintrag in package.json für das Public Repo entfernen
echo "🧹 Entferne private Skripte aus dem öffentlichen Branch..."
rm -f scripts/sync-public.sh
git rm --cached scripts/sync-public.sh 2>/dev/null || true

# sync:public aus package.json entfernen (nutzt jq falls vorhanden, sonst sed)
if command -v jq >/dev/null 2>&1; then
  jq 'del(.scripts["sync:public"])' package.json > package.tmp.json && mv package.tmp.json package.json
else
  sed -i '' '/"sync:public":/d' package.json
fi
# Das entfernte Komma bei Bedarf fixen (falls sync:public der letzte Eintrag war)
sed -i '' 's/, *$//' package.json || true
git add package.json

# Prüfen, ob es überhaupt Änderungen gab
if [[ -z $(git status --porcelain) ]]; then
  echo "✅ Keine Änderungen zum Synchronisieren gefunden."
  git checkout $CURRENT_BRANCH
  exit 0
fi

# Commit-Nachricht vergeben (Standard: letzte Commit-Nachricht aus dem privaten Branch)
LAST_MSG=$(git log -1 --pretty=%B $CURRENT_BRANCH | head -n 1)
COMMIT_MSG=${1:-"$LAST_MSG"}
git commit -m "$COMMIT_MSG"

# Zum öffentlichen Repository pushen (lokaler public-* Branch wird auf den regulären Namen gemappt)
git push public $PUBLIC_BRANCH:$CURRENT_BRANCH

# Zurück auf den Arbeitsbranch wechseln
git checkout $CURRENT_BRANCH

echo "🎉 Erfolgreich synchronisiert!"
