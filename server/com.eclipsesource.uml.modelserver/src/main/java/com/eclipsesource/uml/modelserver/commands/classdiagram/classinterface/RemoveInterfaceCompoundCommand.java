package com.eclipsesource.uml.modelserver.commands.classdiagram.classinterface;

import com.eclipsesource.uml.modelserver.commands.classdiagram.association.RemoveAssociationCompoundCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.Model;
import org.eclipse.uml2.uml.Property;

import java.util.Collection;

public class RemoveInterfaceCompoundCommand extends CompoundCommand {

   public RemoveInterfaceCompoundCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
      this.append(new RemoveInterfaceCommand(domain, modelUri, semanticUriFragment));
      this.append(new RemoveInterfaceShapeCommand(domain, modelUri, semanticUriFragment));

      Model umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);
      Interface interfaceToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Interface.class);

      Collection<Setting> usagesInterface = EcoreUtil.UsageCrossReferencer.find(interfaceToRemove, umlModel.eResource());
      for (Setting setting : usagesInterface) {
         EObject object = setting.getEObject();
         if (isAssociationTypeUsage(setting, object)) {
            String associationUriFragment = UmlNotationCommandUtil.getSemanticProxyUri((Association) object.eContainer());
            this.append(new RemoveAssociationCompoundCommand(domain, modelUri, semanticUriFragment));
         }
      }
   }


   protected boolean isAssociationTypeUsage(final Setting setting, final EObject eObject) {
      return eObject instanceof Property
            && eObject.eContainer() instanceof Association
            && ((Property) eObject).getAssociation() != null;
   }

}
