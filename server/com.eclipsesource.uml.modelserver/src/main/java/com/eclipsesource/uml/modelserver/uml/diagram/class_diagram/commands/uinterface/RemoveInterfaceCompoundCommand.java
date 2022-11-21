package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Association;
import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlRemoveNotationElementCommand;
import com.eclipsesource.uml.modelserver.shared.utils.UmlSemanticUtil;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association.RemoveAssociationCompoundCommand;

public class RemoveInterfaceCompoundCommand extends CompoundCommand {

   public RemoveInterfaceCompoundCommand(final EditingDomain domain, final URI modelUri,
      final Interface interfaceToRemove) {
      this.append(new RemoveInterfaceSemanticCommand(domain, modelUri, interfaceToRemove));
      this.append(new UmlRemoveNotationElementCommand(domain, modelUri, interfaceToRemove));

      var umlModel = UmlSemanticUtil.getModel(modelUri, domain);
      var usagesInterface = EcoreUtil.UsageCrossReferencer.find(interfaceToRemove,
         umlModel.eResource());

      for (Setting setting : usagesInterface) {
         var object = setting.getEObject();
         if (isAssociationTypeUsage(setting, object)) {
            this.append(new RemoveAssociationCompoundCommand(domain, modelUri, (Association) object));
         }
      }
   }

   protected boolean isAssociationTypeUsage(final Setting setting, final EObject eObject) {
      return eObject instanceof Property
         && eObject.eContainer() instanceof Association
         && ((Property) eObject).getAssociation() != null;
   }
}
