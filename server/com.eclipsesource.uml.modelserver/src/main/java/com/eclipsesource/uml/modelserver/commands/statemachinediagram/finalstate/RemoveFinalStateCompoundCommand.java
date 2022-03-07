package com.eclipsesource.uml.modelserver.commands.statemachinediagram.finalstate;

import com.eclipsesource.uml.modelserver.commands.statemachinediagram.transition.RemoveTransitionCompoundCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.FinalState;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Transition;

import java.util.Collection;

public class RemoveFinalStateCompoundCommand extends CompoundCommand {

    public RemoveFinalStateCompoundCommand(final EditingDomain domain, final URI modelUri,
                                           final String parentSemanticUriFragment, final String semanticUriFragment) {
        this.append(new RemoveFinalStateCommand(domain, modelUri, parentSemanticUriFragment, semanticUriFragment));
        this.append(new RemoveFinalStateShapeCommand(domain, modelUri, semanticUriFragment));

        Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
        FinalState finalStateToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment,
                FinalState.class);

        Collection<Setting> usagesStateMachine = EcoreUtil.UsageCrossReferencer.find(finalStateToRemove, umlModel.eResource());
        for (Setting setting : usagesStateMachine) {
            EObject eObject = setting.getEObject();
            if (eObject instanceof Transition) {
                String transitionUri = UmlSemanticCommandUtil.getSemanticUriFragment((Transition) eObject);
                this.append(
                        new RemoveTransitionCompoundCommand(domain, modelUri, parentSemanticUriFragment, transitionUri));
            }
        }
    }
}
