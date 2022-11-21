package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EStructuralFeature.Setting;
import org.eclipse.emf.ecore.util.EcoreUtil.UsageCrossReferencer;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.Property;
import org.eclipse.uml2.uml.UMLPackage;

import com.eclipsesource.uml.modelserver.shared.notation.commands.UmlRemoveNotationElementCommand;
import com.eclipsesource.uml.modelserver.shared.utils.UmlSemanticUtil;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.SetPropertyTypeSemanticCommand;

public class RemoveEnumerationCompoundCommand extends CompoundCommand {

   public RemoveEnumerationCompoundCommand(final EditingDomain domain, final URI modelUri,
      final Enumeration enumeration) {
      this.append(new RemoveEnumerationSemanticCommand(domain, modelUri, enumeration));
      this.append(new UmlRemoveNotationElementCommand(domain, modelUri, enumeration));

      var umlModel = UmlSemanticUtil.getModel(modelUri, domain);

      var usagesEnumeration = UsageCrossReferencer.find(enumeration, umlModel.eResource());
      for (var setting : usagesEnumeration) {
         var eObject = setting.getEObject();
         if (isPropertyTypeUsage(setting, eObject, enumeration)) {
            this.append(new SetPropertyTypeSemanticCommand(domain, modelUri, (Property) eObject, null));
         }
      }
   }

   protected boolean isPropertyTypeUsage(final Setting setting, final EObject eObject,
      final Enumeration enumerationToRemove) {
      return eObject instanceof Property
         && eObject.eContainer() instanceof org.eclipse.uml2.uml.Class
         && setting.getEStructuralFeature().equals(UMLPackage.Literals.TYPED_ELEMENT__TYPE)
         && enumerationToRemove.equals(((Property) eObject).getType());
   }
}
