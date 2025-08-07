const answers = {};

// Configuration des zones avec descriptions détaillées
const zones = {
    1: {
        name: "FOCUSING",
        description: "Votre équipe maîtrise les bases de l'agilité",
        color: "#ff6b6b",
        benefits: "Transparence, travail d'équipe, valeur business",
        skills: ["Planification centrée utilisateur", "Rétrospectives régulières", "Prise de décision collaborative"],
        weaknessAdvice: {
            0: "Commencez par organiser une rétrospective mensuelle simple : 'Qu'est-ce qui a bien marché ? Qu'est-ce qui peut être amélioré ?'",
            1: "Introduisez des user stories : 'En tant que [utilisateur], je veux [fonctionnalité] pour [bénéfice]'",
            2: "Créez un rituel de décision collective pour les choix techniques importants"
        }
    },
    2: {
        name: "DELIVERING", 
        description: "Votre équipe peut livrer rapidement et de façon fiable",
        color: "#4ecdc4",
        benefits: "Déploiement à la demande, qualité élevée, réduction des risques",
        skills: ["Déploiement sans stress", "Tests automatisés", "Intégration continue"],
        weaknessAdvice: {
            0: "Commencez par mettre en place des tests unitaires sur les fonctions critiques",
            1: "Configurez un pipeline CI/CD simple avec GitHub Actions ou GitLab CI",
            2: "Automatisez vos déploiements avec des scripts ou des outils comme Ansible"
        }
    },
    3: {
        name: "OPTIMIZING",
        description: "Votre équipe s'adapte en permanence grâce aux données",
        color: "#45b7d1", 
        benefits: "Innovation continue, leadership marché, adaptation rapide",
        skills: ["Décisions basées sur les données", "Tests A/B", "Monitoring temps réel"],
        weaknessAdvice: {
            0: "Installez Google Analytics ou un outil de monitoring simple pour comprendre l'usage",
            1: "Mettez en place des feature flags pour tester des fonctionnalités avec une partie des utilisateurs",
            2: "Créez des dashboards simples avec les métriques importantes (temps de réponse, erreurs)"
        }
    },
    4: {
        name: "STRENGTHENING",
        description: "Votre équipe optimise toute l'organisation",
        color: "#667eea",
        benefits: "Influence stratégique, culture collaborative, transformation",
        skills: ["Influence stratégique", "Collaboration inter-équipes", "Formation et mentorat"],
        weaknessAdvice: {
            0: "Proposez des présentations techniques aux autres équipes pour partager vos connaissances",
            1: "Participez aux réunions produit pour donner votre vision technique",
            2: "Organisez des 'lunch & learn' pour former d'autres équipes sur vos bonnes pratiques"
        }
    }
};

function startDiagnostic() {
    document.getElementById('questions-container').style.display = 'block';
    document.getElementById('results').classList.remove('show');
    resetDiagnostic();
}

function resetDiagnostic() {
    Object.keys(answers).forEach(key => delete answers[key]);
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelectorAll('.question').forEach(question => {
        question.classList.remove('answered');
    });
    document.getElementById('results').classList.remove('show');
}

// Gestion des réponses
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('option')) {
        const question = e.target.closest('.question');
        const zone = question.dataset.zone;
        const questionNum = question.dataset.question;
        const value = parseInt(e.target.dataset.value);
        
        // Désélectionner les autres options de cette question
        question.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Sélectionner cette option
        e.target.classList.add('selected');
        question.classList.add('answered');
        
        // Sauvegarder la réponse
        if (!answers[zone]) answers[zone] = {};
        answers[zone][questionNum] = value;
        
        // Vérifier si toutes les questions sont répondues
        checkCompletion();
    }
});

function checkCompletion() {
    const totalQuestions = document.querySelectorAll('.question').length;
    const answeredQuestions = Object.values(answers).reduce((total, zone) => {
        return total + Object.keys(zone).length;
    }, 0);
    
    if (answeredQuestions === totalQuestions) {
        setTimeout(showResults, 500);
    }
}

function showResults() {
    const results = calculateResults();
    displayDetailedReport(results);
}

function calculateResults() {
    const results = {};
    
    for (let zone = 1; zone <= 4; zone++) {
        if (answers[zone]) {
            const zoneAnswers = Object.values(answers[zone]);
            const total = zoneAnswers.reduce((sum, val) => sum + val, 0);
            const maxPossible = zoneAnswers.length * 3;
            const percentage = Math.round((total / maxPossible) * 100);
            
            results[zone] = {
                score: total,
                maxScore: maxPossible,
                percentage: percentage,
                level: getLevel(percentage),
                answers: answers[zone]
            };
        }
    }
    
    return results;
}

function getLevel(percentage) {
    if (percentage >= 80) return "Maîtrisé";
    if (percentage >= 60) return "En progression";
    if (percentage >= 40) return "En développement";
    return "Débutant";
}

function getLevelClass(level) {
    switch(level) {
        case "Maîtrisé": return "level-mastered";
        case "En progression": return "level-progressing";
        case "En développement": return "level-developing";
        default: return "level-beginner";
    }
}

function displayDetailedReport(results) {
    const overallScore = Object.values(results).reduce((sum, result) => sum + result.percentage, 0) / Object.keys(results).length;
    const teamName = localStorage.getItem('teamName') || 'Votre équipe';
    
    let html = `
        <div class="team-info">
            <h3>📊 Résultats du diagnostic - ${teamName}</h3>
            <p><strong>Score global :</strong> ${Math.round(overallScore)}% - ${getLevel(overallScore)}</p>
            <p><strong>Évaluation :</strong> ${getOverallAssessment(overallScore, results)}</p>
        </div>
    `;
    
    html += generateZonesSummary(results);
    html += generateDetailedAnalysis(results);
    html += generateStrengthsWeaknesses(results);
    html += generateActionPlan(results);
    html += generateNextSteps(results);
    
    html += `
        <div style="text-align: center; margin-top: 30px;">
            <button class="btn btn-secondary" onclick="exportDetailedReport()" style="margin-right: 10px;">
                📄 Exporter rapport détaillé
            </button>
            <button class="btn btn-secondary" onclick="resetDiagnostic()">
                🔄 Refaire le diagnostic
            </button>
        </div>
    `;
    
    document.getElementById('results-content').innerHTML = html;
    document.getElementById('results').classList.add('show');
}

function generateZonesSummary(results) {
    let html = `
        <div class="report-section">
            <div class="report-header">
                <span>🎯</span>
                <span>Résumé par zone</span>
            </div>
    `;
    
    for (let zone = 1; zone <= 4; zone++) {
        if (results[zone]) {
            const zoneInfo = zones[zone];
            const result = results[zone];
            
            html += `
                <div class="result-zone">
                    <h4>Zone ${zone}: ${zoneInfo.name}</h4>
                    <div class="maturity-level ${getLevelClass(result.level)}">
                        ${result.level} (${result.percentage}%)
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${result.percentage}%; background: ${zoneInfo.color};"></div>
                    </div>
                </div>
            `;
        }
    }
    
    html += '</div>';
    return html;
}

function generateDetailedAnalysis(results) {
    let html = `
        <div class="report-section">
            <div class="report-header">
                <span>🔍</span>
                <span>Analyse détaillée par zone</span>
            </div>
    `;
    
    for (let zone = 1; zone <= 4; zone++) {
        if (results[zone]) {
            const zoneInfo = zones[zone];
            const result = results[zone];
            
            html += `
                <div style="margin-bottom: 25px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 10px; border-left: 4px solid ${zoneInfo.color};">
                    <h4>Zone ${zone}: ${zoneInfo.name}</h4>
                    <p><strong>Évaluation :</strong> ${getZoneAssessment(result, zoneInfo)}</p>
                    <p><strong>Impact business :</strong> ${zoneInfo.benefits}</p>
                    
                    <div style="margin-top: 15px;">
                        <strong>Détail des réponses :</strong>
                        <ul style="margin-top: 10px; padding-left: 20px;">
            `;
            
            // Analyse des réponses individuelles
            Object.entries(result.answers).forEach(([questionNum, score]) => {
                const questionTexts = getQuestionTexts(zone, questionNum);
                const scoreText = ['Jamais', 'Parfois', 'Souvent', 'Toujours'][score];
                html += `<li>${questionTexts.question} : <strong>${scoreText}</strong></li>`;
            });
            
            html += `
                        </ul>
                    </div>
                </div>
            `;
        }
    }
    
    html += '</div>';
    return html;
}

function generateStrengthsWeaknesses(results) {
    const strengths = [];
    const weaknesses = [];
    
    for (let zone = 1; zone <= 4; zone++) {
        if (results[zone]) {
            const zoneInfo = zones[zone];
            const result = results[zone];
            
            if (result.percentage >= 70) {
                strengths.push({
                    zone: zone,
                    name: zoneInfo.name,
                    percentage: result.percentage,
                    description: zoneInfo.description
                });
            } else if (result.percentage < 50) {
                weaknesses.push({
                    zone: zone,
                    name: zoneInfo.name,
                    percentage: result.percentage,
                    description: zoneInfo.description
                });
            }
        }
    }
    
    let html = `
        <div class="report-section">
            <div class="report-header">
                <span>⚖️</span>
                <span>Forces et axes d'amélioration</span>
            </div>
            
            <div class="strengths-weaknesses">
                <div class="strength-card">
                    <h4>💪 Points forts</h4>
    `;
    
    if (strengths.length > 0) {
        strengths.forEach(strength => {
            html += `
                <div style="margin-bottom: 15px;">
                    <strong>Zone ${strength.zone}: ${strength.name}</strong> (${strength.percentage}%)
                    <br><em>${strength.description}</em>
                </div>
            `;
        });
    } else {
        html += '<p><em>Toutes les zones ont un potentiel d\'amélioration. C\'est une excellente opportunité de croissance !</em></p>';
    }
    
    html += `
                </div>
                
                <div class="weakness-card">
                    <h4>🎯 Axes d'amélioration</h4>
    `;
    
    if (weaknesses.length > 0) {
        weaknesses.forEach(weakness => {
            html += `
                <div style="margin-bottom: 15px;">
                    <strong>Zone ${weakness.zone}: ${weakness.name}</strong> (${weakness.percentage}%)
                    <br><em>Opportunité de développement prioritaire</em>
                </div>
            `;
        });
    } else {
        html += '<p><em>Excellente progression ! Continuez à maintenir et perfectionner vos acquis.</em></p>';
    }
    
    html += `
                </div>
            </div>
        </div>
    `;
    
    return html;
}

function generateActionPlan(results) {
    const actions = [];
    
    for (let zone = 1; zone <= 4; zone++) {
        if (results[zone] && results[zone].percentage < 70) {
            const zoneInfo = zones[zone];
            const result = results[zone];
            
            // Analyser les réponses spécifiques pour donner des conseils ciblés
            Object.entries(result.answers).forEach(([questionNum, score]) => {
                if (score < 2) { // Score faible
                    const advice = zoneInfo.weaknessAdvice[questionNum];
                    if (advice) {
                        actions.push({
                            zone: zone,
                            zoneName: zoneInfo.name,
                            action: advice,
                            priority: getPriority(zone, score),
                            timeframe: getTimeframe(zone, score)
                        });
                    }
                }
            });
        }
    }
    
    // Trier par priorité
    actions.sort((a, b) => {
        const priorityOrder = { 'Haute': 3, 'Moyenne': 2, 'Basse': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    let html = `
        <div class="report-section">
            <div class="report-header">
                <span>📋</span>
                <span>Plan d'action recommandé</span>
            </div>
            
            <p><strong>Recommandations personnalisées :</strong></p>
            <div class="action-plan">
    `;
    
    if (actions.length > 0) {
        actions.slice(0, 6).forEach((action, index) => { // Limiter à 6 actions
            const priorityClass = `priority-${action.priority.toLowerCase().replace('sse', 'se').replace('te', 'gh')}`;
            html += `
                <div class="action-item ${priorityClass}">
                    <div style="flex: 1;">
                        <strong>Zone ${action.zone} (${action.zoneName}) :</strong>
                        <p>${action.action}</p>
                        <small><strong>Priorité :</strong> ${action.priority} | <strong>Délai :</strong> ${action.timeframe}</small>
                    </div>
                </div>
            `;
        });
    } else {
        html += `
            <div class="action-item priority-low">
                <div>
                    <strong>🎉 Excellente performance !</strong>
                    <p>Votre équipe montre une bonne maîtrise de l'agilité. Concentrez-vous sur le maintien de ces bonnes pratiques et le partage de votre expérience avec d'autres équipes.</p>
                </div>
            </div>
        `;
    }
    
    html += '</div></div>';
    return html;
}

function generateNextSteps(results) {
    const overallScore = Object.values(results).reduce((sum, result) => sum + result.percentage, 0) / Object.keys(results).length;
    
    let html = `
        <div class="next-steps">
            <div class="report-header">
                <span>🚀</span>
                <span>Prochaines étapes</span>
            </div>
            
            ${getNextStepsAdvice(overallScore, results)}
            
            <div class="timeline">
                <h4>📅 Chronologie suggérée :</h4>
    `;
    
    const timeline = getTimeline(results);
    timeline.forEach(item => {
        html += `
            <div class="timeline-item">
                <div class="timeline-badge">${item.period}</div>
                <div style="flex: 1;">
                    <strong>${item.title}</strong>
                    <p>${item.description}</p>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                <strong>💡 Conseil final :</strong>
                <p>L'agilité est un voyage, pas une destination. Célébrez vos progrès, apprenez de vos échecs, et gardez toujours l'utilisateur au centre de vos préoccupations !</p>
            </div>
        </div>
    `;
    
    return html;
}

// Fonctions utilitaires pour l'analyse
function getOverallAssessment(score, results) {
    if (score >= 80) {
        return "Votre équipe démontre une excellente maîtrise de l'agilité. Vous êtes un modèle pour l'organisation !";
    } else if (score >= 60) {
        return "Votre équipe est sur la bonne voie avec de solides fondations agiles. Quelques améliorations ciblées vous permettront d'atteindre l'excellence.";
    } else if (score >= 40) {
        return "Votre équipe a commencé sa transformation agile. Il y a de bonnes bases à consolider et plusieurs opportunités d'amélioration.";
    } else {
        return "Votre équipe débute son parcours agile. C'est le moment idéal pour poser de solides fondations et progresser étape par étape.";
    }
}

function getZoneAssessment(result, zoneInfo) {
    if (result.percentage >= 80) {
        return `Excellente maîtrise de cette zone ! Votre équipe excelle dans ${zoneInfo.name.toLowerCase()}.`;
    } else if (result.percentage >= 60) {
        return `Bonne progression dans cette zone. Quelques ajustements permettront d'optimiser ${zoneInfo.name.toLowerCase()}.`;
    } else if (result.percentage >= 40) {
        return `Zone en développement. Des efforts ciblés sur ${zoneInfo.name.toLowerCase()} apporteront des bénéfices significatifs.`;
    } else {
        return `Zone prioritaire d'amélioration. Investir dans ${zoneInfo.name.toLowerCase()} transformera l'efficacité de l'équipe.`;
    }
}

function getQuestionTexts(zone, questionNum) {
    const questions = {
        1: {
            1: { question: "Planification centrée utilisateur" },
            2: { question: "Rétrospectives régulières" },
            3: { question: "Prise de décision collaborative" }
        },
        2: {
            1: { question: "Déploiement à la demande" },
            2: { question: "Tests automatisés" },
            3: { question: "Intégration continue" }
        },
        3: {
            1: { question: "Décisions basées sur les données" },
            2: { question: "Tests A/B et expérimentation" },
            3: { question: "Monitoring et alertes" }
        },
        4: {
            1: { question: "Influence stratégique" },
            2: { question: "Collaboration inter-équipes" },
            3: { question: "Formation et mentorat" }
        }
    };
    return questions[zone][questionNum];
}

function getPriority(zone, score) {
    if (zone <= 2 && score === 0) return "Haute";
    if (score === 0) return "Moyenne";
    return "Basse";
}

function getTimeframe(zone, score) {
    if (zone <= 2 && score === 0) return "1-2 mois";
    if (score === 0) return "2-3 mois";
    return "3-6 mois";
}

function getNextStepsAdvice(overallScore, results) {
    if (overallScore >= 80) {
        return `
            <p><strong>🎉 Félicitations !</strong> Votre équipe a atteint un niveau d'excellence agile. Voici comment maintenir et amplifier ce succès :</p>
            <ul>
                <li>Partagez vos bonnes pratiques avec d'autres équipes</li>
                <li>Participez à des conférences agiles pour inspirer la communauté</li>
                <li>Continuez à innover et expérimenter</li>
                <li>Mentorez d'autres équipes dans leur transformation</li>
            </ul>
        `;
    } else if (overallScore >= 60) {
        return `
            <p><strong>👏 Très bon travail !</strong> Votre équipe progresse bien. Voici les prochaines étapes pour atteindre l'excellence :</p>
            <ul>
                <li>Identifiez et corrigez les derniers points bloquants</li>
                <li>Automatisez davantage vos processus</li>
                <li>Renforcez la collaboration avec les autres équipes</li>
                <li>Mesurez et optimisez continuellement</li>
            </ul>
        `;
    } else {
        return `
            <p><strong>🚀 En route vers l'agilité !</strong> Votre équipe a de bonnes bases. Voici comment accélérer la transformation :</p>
            <ul>
                <li>Concentrez-vous d'abord sur les zones 1 et 2 (Foundation)</li>
                <li>Formez l'équipe aux pratiques agiles essentielles</li>
                <li>Commencez petit avec des victoires rapides</li>
                <li>Demandez l'accompagnement d'un coach agile si nécessaire</li>
            </ul>
        `;
    }
}

function getTimeline(results) {
    const timeline = [];
    
    // Analyser les besoins selon les résultats
    const weakZones = [];
    for (let zone = 1; zone <= 4; zone++) {
        if (results[zone] && results[zone].percentage < 60) {
            weakZones.push(zone);
        }
    }
    
    if (weakZones.includes(1)) {
        timeline.push({
            period: "Mois 1",
            title: "Fondations agiles",
            description: "Mettre en place les rétrospectives et améliorer la collaboration d'équipe"
        });
    }
    
    if (weakZones.includes(2)) {
        timeline.push({
            period: "Mois 2-3",
            title: "Qualité et automatisation",
            description: "Implémenter les tests automatisés et l'intégration continue"
        });
    }
    
    if (weakZones.includes(3)) {
        timeline.push({
            period: "Mois 4-6",
            title: "Données et expérimentation",
            description: "Installer le monitoring et commencer les tests A/B"
        });
    }
    
    if (weakZones.includes(4)) {
        timeline.push({
            period: "Mois 6+",
            title: "Leadership et influence",
            description: "Développer l'influence organisationnelle et le mentorat"
        });
    }
    
    if (timeline.length === 0) {
        timeline.push({
            period: "Continu",
            title: "Amélioration continue",
            description: "Maintenir l'excellence et partager les bonnes pratiques"
        });
    }
    
    return timeline;
}

function exportResults() {
    if (Object.keys(answers).length === 0) {
        alert('Veuillez d\'abord compléter le diagnostic !');
        return;
    }
    
    const results = calculateResults();
    const exportData = {
        timestamp: new Date().toISOString(),
        answers: answers,
        results: results,
        teamName: prompt('Nom de l\'équipe (optionnel):') || 'Équipe anonyme'
    };
    
    localStorage.setItem('teamName', exportData.teamName);
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `agile-fluency-${exportData.teamName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

function exportDetailedReport() {
    const results = calculateResults();
    const teamName = localStorage.getItem('teamName') || 'Équipe';
    const date = new Date().toLocaleDateString('fr-FR');
    
    // Créer un rapport texte détaillé
    let report = `RAPPORT D'ÉVALUATION AGILE FLUENCY\n`;
    report += `=====================================\n\n`;
    report += `Équipe: ${teamName}\n`;
    report += `Date: ${date}\n\n`;
    
    const overallScore = Object.values(results).reduce((sum, result) => sum + result.percentage, 0) / Object.keys(results).length;
    report += `SCORE GLOBAL: ${Math.round(overallScore)}% - ${getLevel(overallScore)}\n\n`;
    
    report += `DÉTAIL PAR ZONE:\n`;
    report += `================\n`;
    
    for (let zone = 1; zone <= 4; zone++) {
        if (results[zone]) {
            const zoneInfo = zones[zone];
            const result = results[zone];
            
            report += `\nZone ${zone}: ${zoneInfo.name}\n`;
            report += `Score: ${result.percentage}% (${result.level})\n`;
            report += `Description: ${zoneInfo.description}\n`;
            report += `Bénéfices: ${zoneInfo.benefits}\n`;
        }
    }
    
    const reportBlob = new Blob([report], {type: 'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(reportBlob);
    link.download = `rapport-agile-fluency-${teamName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
}

function importResults(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            
            // Restaurer les réponses
            Object.assign(answers, importData.answers);
            
            // Sauvegarder le nom d'équipe
            localStorage.setItem('teamName', importData.teamName);
            
            // Mettre à jour l'interface
            Object.keys(answers).forEach(zone => {
                Object.keys(answers[zone]).forEach(questionNum => {
                    const question = document.querySelector(`[data-zone="${zone}"][data-question="${questionNum}"]`);
                    const value = answers[zone][questionNum];
                    
                    question.querySelectorAll('.option').forEach(option => {
                        option.classList.remove('selected');
                        if (parseInt(option.dataset.value) === value) {
                            option.classList.add('selected');
                        }
                    });
                    question.classList.add('answered');
                });
            });
            
            showResults();
            alert(`Résultats importés pour l'équipe: ${importData.teamName}`);
            
        } catch (error) {
            alert('Erreur lors de l\'import du fichier. Vérifiez que c\'est un fichier de diagnostic valide.');
        }
    };
    reader.readAsText(file);
}