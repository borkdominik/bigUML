package com.eclipsesource.uml.modelserver.commands.usecasediagram.actor;

import com.eclipsesource.uml.modelserver.commands.classdiagram.association.RemoveAssociationCompoundCommand;
import com.eclipsesource.uml.modelserver.commands.classdiagram.property.SetPropertyTypeCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.*;
import org.eclipse.uml2.uml.Class;

import java.util.Collection;

public class RemoveActorCompoundCommand extends CompoundCommand {

    public RemoveActorCompoundCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
        Actor actorToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Actor.class);

        Collection<EStructuralFeature.Setting> usagesActor = EcoreUtil.UsageCrossReferencer.find(actorToRemove, umlModel.eResource());
        for (EStructuralFeature.Setting setting : usagesActor) {
            EObject eObject = setting.getEObject();
            //TODO: add these later (especially the generalisation) once they are ready and corrected
            /*if (isPropertyTypeUsage(setting, eObject, actorToRemove)) {
                String propertyUriFragment = UmlSemanticCommandUtil.getSemanticUriFragment((Property) eObject);
                this.append(new SetPropertyTypeCommand(domain, modelUri, propertyUriFragment, null));
            } else if (isAssociationTypeUsage(setting, eObject)) {
                String associationUriFragment = UmlNotationCommandUtil
                        .getSemanticProxyUri((Relationship) eObject.eContainer());
                this.append(new RemoveAssociationCompoundCommand(domain, modelUri, associationUriFragment));
            } else if (isGeneralizationTypeUsage(setting, eObject)) {
                String extendUriFragment = UmlSemanticCommandUtil
                        .getSemanticUriFragment((Relationship) eObject);
                this.append(new RemoveGeneralizationCompoundCommand(domain, modelUri, extendUriFragment));
            }*/

        }
        this.append(new RemoveActorCommand(domain, modelUri, semanticUriFragment));
        this.append(new RemoveActorShapeCommand(domain, modelUri, semanticUriFragment));
    }

    //TODO: check why this is still in here!!!!!!!!! makes no sense as it is referencing to Class diagram!
    protected boolean isPropertyTypeUsage(final EStructuralFeature.Setting setting, final EObject eObject, final Actor classToRemove) {
        return eObject instanceof Property
                && eObject.eContainer() instanceof Class
                && setting.getEStructuralFeature().equals(UMLPackage.Literals.TYPED_ELEMENT__TYPE)
                && classToRemove.equals(((Property) eObject).getType());
    }
    //TODO: check why this is still in here!!!!!!!!! makes no sense as it is referencing to Class diagram!
    protected boolean isAssociationTypeUsage(final EStructuralFeature.Setting setting, final EObject eObject) {
        return eObject instanceof Property
                && eObject.eContainer() instanceof Association
                && ((Property) eObject).getAssociation() != null;
    }

    protected boolean isGeneralizationTypeUsage(final EStructuralFeature.Setting setting, final EObject eObject) {
        return eObject instanceof Generalization
                && ((Generalization) eObject).eContainer() instanceof UseCase
                && ((Generalization) eObject).getSpecific() != null;
    }
}
