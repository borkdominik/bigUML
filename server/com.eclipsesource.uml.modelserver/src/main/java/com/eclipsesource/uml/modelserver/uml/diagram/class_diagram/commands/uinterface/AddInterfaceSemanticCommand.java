package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface;

import org.eclipse.uml2.uml.Interface;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.generator.NameGenerator;
import com.eclipsesource.uml.modelserver.uml.generator.PackageableElementNameGenerator;

public class AddInterfaceSemanticCommand extends UmlSemanticElementCommand {

   protected final Interface newInterface;
   protected final NameGenerator nameGenerator;

   public AddInterfaceSemanticCommand(final ModelContext context) {
      super(context);
      this.newInterface = UMLFactory.eINSTANCE.createInterface();
      this.nameGenerator = new PackageableElementNameGenerator(context, Interface.class);
   }

   @Override
   protected void doExecute() {
      newInterface.setName(nameGenerator.newName());
      model.getPackagedElements().add(newInterface);
   }

   public Interface getNewInterface() { return newInterface; }
}
