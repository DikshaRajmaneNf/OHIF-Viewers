#!/bin/bash

echo "\nWhat would you like to do?"
echo "1) Push a commit"
echo "2) Create a PR"
echo "3) Push and raise a PR"
read -p "Enter the number (1 | 2 | 3): " action
if [[ "$action" < "1" || "$action" > "3" ]]; then
  echo "Invalid option. Exiting.\n"
  exit 1
fi

declare TYPES
TYPES[1]="🔥 feat: "
TYPES[2]="🐛 fix: "
TYPES[3]="📝 docs: "
TYPES[4]="🦋 style: "
TYPES[5]="🧩 refactor: "
TYPES[6]="📈 perf: "
TYPES[7]="✅ test: "
TYPES[8]="🤓 chore: "
TYPES[9]="🔀 merge: "
TYPES[10]="🚀 deployment: "

declare DESCRIPTIONS
DESCRIPTIONS[1]="A new feature"
DESCRIPTIONS[2]="A bug fix"
DESCRIPTIONS[3]="Documentation only changes"
DESCRIPTIONS[4]="Code style changes"
DESCRIPTIONS[5]="Code refactoring"
DESCRIPTIONS[6]="Performance improvements"
DESCRIPTIONS[7]="Adding or fixing tests"
DESCRIPTIONS[8]="Other changes that don't modify src or tests"
DESCRIPTIONS[9]="Merge branches"
DESCRIPTIONS[10]="Deployment related changes"

echo "\nSelect the type of commit/PR:"
for i in $(seq 1 ${#TYPES[@]}); do
  if [[ -n "${TYPES[$i]}" ]]; then
    echo "$i) ${TYPES[$i]} ${DESCRIPTIONS[$i]}"
  fi
done

echo
read -p "Enter the number: " type_num

# Validate input
if [[ -z "${TYPES[$type_num]}" ]]; then
  echo "\nInvalid type selection. Exiting."
  exit 1
fi

echo
read -p "Enter your commit message or PR title: " msg

final_msg="${TYPES[$type_num]}$msg"

branch=$(git symbolic-ref --short HEAD)
git add .
git commit -m "$final_msg"
git push origin "$branch"
echo "✅ Successfully pushed to branch '$branch' with commit message:"
echo "$final_msg"

# If PR
if [[ "$action" == "2" || "$action" == "3" ]]; then
  echo "\nCreating a PR..."
  read -p "Enter the base branch to merge into (default: main): " base_branch
  base_branch=${base_branch:-main}
  read -p "Enter PR description (optional): " pr_body
  # Create PR using GitHub CLI
  gh pr create --base "$base_branch" --head "$branch" --title "$final_msg" --body "$pr_body"
  echo "🎯 PR created successfully!"
fi