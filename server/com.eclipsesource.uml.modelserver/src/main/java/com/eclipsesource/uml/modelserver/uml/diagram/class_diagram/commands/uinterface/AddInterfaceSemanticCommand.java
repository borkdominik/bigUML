package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.generator.NameGenerator;
import com.eclipsesource.uml.modelserver.uml.generator.PackageableElementNameGenerator;

public class AddInterfaceSemanticCommand extends UmlSemanticElementCommand {

   protected final Interface newInterface;
   protected final NameGenerator nameGenerator;

   public AddInterfaceSemanticCommand(final EditingDomain domain, final URI modelUri) {
      super(domain, modelUri);
      this.newInterface = UMLFactory.eINSTANCE.createInterface();
      this.nameGenerator = new PackageableElementNameGenerator(Interface.class, modelUri, domain);
   }

   @Override
   protected void doExecute() {
      newInterface.setName(nameGenerator.newName());
      model.getPackagedElements().add(newInterface);
   }

   public Interface getNewInterface() { return newInterface; }
}
