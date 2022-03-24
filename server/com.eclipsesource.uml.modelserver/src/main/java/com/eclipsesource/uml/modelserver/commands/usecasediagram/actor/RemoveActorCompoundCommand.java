package com.eclipsesource.uml.modelserver.commands.usecasediagram.actor;

import com.eclipsesource.uml.modelserver.commands.usecasediagram.generalization.RemoveGeneralizationCompoundCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.*;

import java.util.Collection;

public class RemoveActorCompoundCommand extends CompoundCommand {

    public RemoveActorCompoundCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
        Actor actorToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Actor.class);

        Collection<EStructuralFeature.Setting> usagesActor = EcoreUtil.UsageCrossReferencer.find(actorToRemove, umlModel.eResource());
        for (EStructuralFeature.Setting setting : usagesActor) {
            EObject eObject = setting.getEObject();
            if (isGeneralizationTypeUsage(eObject)) {
                String extendUriFragment = UmlSemanticCommandUtil
                        .getSemanticUriFragment((Relationship) eObject);
                this.append(new RemoveGeneralizationCompoundCommand(domain, modelUri, extendUriFragment));
            }
        }
        this.append(new RemoveActorCommand(domain, modelUri, semanticUriFragment));
        this.append(new RemoveActorShapeCommand(domain, modelUri, semanticUriFragment));
    }

    protected boolean isGeneralizationTypeUsage(final EObject eObject) {
        return eObject instanceof Generalization
                && (eObject).eContainer() instanceof UseCase
                && ((Generalization) eObject).getSpecific() != null;
    }
}
