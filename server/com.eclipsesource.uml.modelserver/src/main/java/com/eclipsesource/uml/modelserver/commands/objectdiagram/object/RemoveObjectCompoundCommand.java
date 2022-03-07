package com.eclipsesource.uml.modelserver.commands.objectdiagram.object;

import com.eclipsesource.uml.modelserver.commands.classdiagram.association.RemoveAssociationCompoundCommand;
import com.eclipsesource.uml.modelserver.commands.classdiagram.clazz.RemoveClassCommand;
import com.eclipsesource.uml.modelserver.commands.classdiagram.clazz.RemoveClassShapeCommand;
import com.eclipsesource.uml.modelserver.commands.classdiagram.property.SetPropertyTypeCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
//import org.eclipse.uml2.uml.InstanceSpecification;
import org.eclipse.uml2.uml.*;
import org.eclipse.uml2.uml.Class;

import java.util.Collection;

public class RemoveObjectCompoundCommand extends CompoundCommand {

    public RemoveObjectCompoundCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        this.append(new RemoveClassCommand(domain, modelUri, semanticUriFragment));
        this.append(new RemoveClassShapeCommand(domain, modelUri, semanticUriFragment));

        Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
        Class objectToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Class.class);

        Collection<EStructuralFeature.Setting> usagesObject = EcoreUtil.UsageCrossReferencer.find(objectToRemove, umlModel.eResource());
        for (EStructuralFeature.Setting setting : usagesObject) {
            EObject eObject = setting.getEObject();
            if (isAttributeTypeUsage(setting, eObject, objectToRemove)) {
                String propertyUriFragment = UmlSemanticCommandUtil.getSemanticUriFragment((Property) eObject);
                this.append(new SetPropertyTypeCommand(domain, modelUri, propertyUriFragment, null));
            } else if (isLinkTypeUsage(setting, eObject)) {
                String associationUriFragment = UmlNotationCommandUtil
                        .getSemanticProxyUri((Association) eObject.eContainer());
                this.append(new RemoveAssociationCompoundCommand(domain, modelUri, associationUriFragment));
            }
        }
    }

    protected boolean isAttributeTypeUsage ( final EStructuralFeature.Setting setting, final EObject eObject,
    final Class classToRemove){
        return eObject instanceof Property
                && eObject.eContainer() instanceof Class
                && setting.getEStructuralFeature().equals(UMLPackage.Literals.TYPED_ELEMENT__TYPE)
                && classToRemove.equals(((Property) eObject).getType());
    }

    protected boolean isLinkTypeUsage ( final EStructuralFeature.Setting setting, final EObject eObject){
        return eObject instanceof Property
                && eObject.eContainer() instanceof Association
                && ((Property) eObject).getAssociation() != null;
    }
}